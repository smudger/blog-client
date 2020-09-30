---
tags:
- ddd
- " blog"
- validation
- java
- spring
is_live: false
title: Implementing validation in the DDD paradigm
author: Smudger
category: Blog
created_at: 2020-09-22T21:00:00+01:00
excerpt: ''

---
I've recently joined a project early in its life and we're currently in the process of deciding our design approach for various components of the system. It's a very exciting project for me as we're trying to follow the principles of domain-driven design (DDD) as much as possible. Whilst I've read both the [blue book](https://www.domainlanguage.com/ddd/blue-book/ "Domain-Driven Design (Eric Evans)") and the [red book](https://dddcommunity.org/book/implementing-domain-driven-design-by-vaughn-vernon/ "Implementing Domain-Driven Design (Vaughn Vernon)"), I must admit this is the first time I've worked on a project that is attempting to follow DDD, so this is largely a new landscape to me. Therefore, I figured it might be useful to write something about the various challenges we face along the way in the hope that it will offer some insight into the considerations we have been making as we grow the system out. With that in mind, let's roll our sleeves up and get started on the first topic... validation!

### The little aggregate that could (validate itself)

A great introduction to this topic comes from [Microsoft](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations "Design validations in the domain model layer (Microsoft)") in a series they have written on implementing DDD. They begin by reiterating the _generally_ accepted DDD axiom that the main responsibility of an aggregate is to ensure it is always in a valid state. Furthermore, an aggregate should protect itself from being made invalid. In practice, this would mean placing checks on any method they expose which changes their state and reject any changes that would cause them to become invalid.

Let's explore this proposal a little more. Firstly, we need to settle on what we mean for an aggregate to be valid. We will soon see that this is a tricky concept to pin down, but for now let us come up with a simple first pass. Following the principles of DDD, let us first define an aggregate to be valid if it is in a state that is possible in the real world.

For example, consider an inventory management system for a bookstore. This system may feature a book aggregate, containing a stock count property, which would store the number of those books left in stock. Let's consider which values are valid for this stock count property to take. Certainly, we should accept positive integers as a value. We would probably also accept zero to indicate that that bock is out of stock. Conversely, it would be nonsensical to accept negative integers, as we have no concept of having negative books in stock. Similarly, a fractional stock count would be meaningless in our domain. Therefore, we are led to the conclusion that our product aggregate is valid only if its stock count is always a non-negative integer.

Consider the statement that an aggregate should ensure that it is always in a valid state. This is a very appealing proposition for callers of our aggregate. By enforcing that an aggregate is always valid, we protect callers against writing code to check for and handle cases that would not be possible in the real world. 

For example, consider the process for ordering books from our bookstore. Suppose our book aggregate does not ensure it is always in a valid state. Our domain expert has told us, quite rightly, that we should allow a customer to order a product if we have the product left in stock and reject the order if the stock count is zero. Following their guidance, we implement the following.

    public void orderBook(Book book) {
    	if(book.stockCount === 0) {
        	throw new OutOfStockException();
        }
        
        Order order = new Order();
        order.add(book);
        
        // Take payment, send confirmation, etc.
    }

Without a guarantee that the book is in a valid state, there are a couple of extra cases to consider here. What should we do if the stock count is negative? What should we do if the stock count is a fraction? If you posed  these questions to the domain expert, you would probably get little more answer than a baffled expression. Not to worry, we think, we can just handle this ourselves. Left to our own devices, perhaps we decide to throw an exception if we encounter this strange event.

    public void orderBook(Book book) {
    	if(book.stockCount < 0 || ! book instanceof Integer) {
        	throw new InvalidStockCountException();
        }
    
    	if(book.stockCount === 0) {
        	throw new OutOfStockException();
        }
        
        Order order = new Order();
        order.add(book);
        
        // Take payment, send confirmation, etc.
    }

Notice how, even just the addition of those three lines, has made our method much harder to follow. Consider, the difference in explaining the two methods to a domain expert. A somewhat savvy domain expert could pretty easily follow our first method. However, they would likely raise an eyebrow at our second one. "But why are you checking if the stock levels are negative? That's obviously _not possible._" DDD alarm bells should be ringing. Our model should be an accurate reflection on the real world domain, and yet we have been forced into handling cases in the model that would not exist in the real world. Not great.

Consider also, how much repetition we can remove by moving this check into the book model. Before, we would likely have to repeat this check wherever we make use of the book's stock count across the app. However, moving this check into the book aggregate not only reduces the duplication of the handling code, but it moves it to a place where it is relevant to the action being performed.

    public class Book {
        private Integer stockCount;
        
        public Book(Integer stockCount) {
        	validate(stockCount);
            this.stockCount = stockCount;
        }
        
        public void setStockCount(Integer stockCount) {
        	validate(stockCount);
            this.stockCount = stockCount;
        }
        
        private void validate(Integer stockCount) {
        	if (stockCount < 0) {
            	throw new InvalidStockCountException();
            }
        }
    }

Furthermore, Microsoft's article makes an interesting point about how we would test drive logic for creating an order for books in the case that our book aggregate is not always valid. In this case, the issues with a book not being valid are made glaringly obvious.

    void when_a_customer_orders_a_product_with_negative_stock_then_...() {
    	// TODO
    }
    
    void when_a_customer_orders_a_product_with_fractional_stock_then_...() {
    	// TODO
    }

I can guarantee these test cases were not the result of a business requirement. Furthermore, we would have to repeat these test cases across every piece of functionality making use of the stock count property on the book aggregate. Feels quite repetitive eh?

This idea of the always-valid aggregate seems like a good one. We've reduced repetition in both our production code and our test cases, and we're less likely to introduce bugs as a result of forgetting to check for these nonsensical cases. Callers of our aggregate are free to use the aggregate, safe in the knowledge that they only need to handle cases with real world meaning.

### Adding another dimension

I mentioned that the definition of valid was slightly nuanced. In fact, [Jeffrey Palermo](https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/  "The fallacy of the always valid entity (Jeffrey Palermo)") and [Jimmy Bogard](https://lostechies.com/jimmybogard/2009/02/15/validation-in-a-ddd-world/ "Validation in a DDD world (Los Techies)") would argue that our first definition is missing a key dimension, namely the context against which we are determining validity.

In order to take out a new loan, a customer must have a valid credit check. In order to update a post on a blog, the user must have write permissions for that post. In order to pay an invoice, there must already be a purchase order for the same amount. Domains are full of business rules about whether or not certain operations can be performed. Notice the additional phrase we add to these business rules. There is a subtle difference between the statement that a customer is valid if they have a valid credit check and the statement that a customer must have a valid credit check _in order to take out a loan_. We are no longer concerned with the validity of an aggregate, rather we are interested in whether that aggregate can perform a certain operation. In the banking domain, you can still be a customer even if you don't have a valid credit check, you're just more restricted in the operations you can perform. This is the issue Jeffrey and Jimmy are raising with our initial definition. Jimmy writes the following.

> Instead of answering the question, “Is this object valid?”, try and answer the question, “Can this operation be performed?”.

Furthermore, and at odds to our previous line of reasoning, they argue that the validation of this type of rule actually belongs next the logic for the operation.

Consider an airline ticket booking system. We've designed our passenger aggregate, storing their passport number, their email address, and perhaps a few other properties. We've validated everything inside the aggregate and we're happily chugging along selling tickets to passengers, spamming them with booking confirmations and marketing content via email, blah blah blah.

Until one day, our system encounters Joanne. Joanne's trying to book a ticket from Berlin to Cape Town to visit relatives. But there's a catch. She's a bit of a technophobe and doesn't have an email address. In our initial pass at validation, this is a bit of an issue. Our passenger aggregate always needs an email address. So what can we do? Refuse to let her fly with our airline unless she creates an email address? Turning away paying customers doesn't feel like a great business decision. Perhaps, we could create a new aggregate for passengers without email addresses, a TechnophobicPassenger? Not great either, as we've now arbitrarily split passengers into two different aggregates due to a constraint of our system rather than because of a distinction that exists in the real world domain. Not very DDD-y.

Conversely, consider Jeffrey and Jimmy's approach. Ask yourself why our passenger aggregate needs to have an email address. The only part of our system that actually makes use of the passenger's email address is our email module. Therefore, our initial statement that "a passenger is valid only if it has an email address" becomes the far more illuminating business rule that "in order to send a booking confirmation email, the passenger must have an email address."

Furthermore, as this constraint is only required for the email module we can shove the validation logic in there, next to where it is actually relied upon, and move it out of the passenger aggregate.

This sounds very appealing to our ticket booking system. Now, all the Joannes of the world can still be classified as passengers using the same aggregate, just like they are in the real world domain. Sure, we can't send them their booking confirmation by email, but maybe we can ask them to pick it up at the airport instead or even send it by post. Retro.

### Onward to enlightenment

What we've discovered are that actually our system has two distinct concepts worthy of validation. This also is viewpoint Greg Young concludes. In our first case, we have aggregate invariants. These are the invariants so fundamental to the definition of the aggregate that it would be frustrating and repetitive to have to repeat their validation across every caller of the aggregate. Secondly, we have business rules. These rules are phrased in the context of operations and define whether the operation can go ahead. Let's expose each one in turn.

Let's consider aggregate invariants first. We consider these to be the definition of an aggregate. They are a list of defining characteristics that allow us to identify whether an object is truly an instance of our aggregate. Even if an object satisfies all but one aggregate invariant, it cannot be considered an instance of the aggregate.

Consider a cyclops with two eyes. Is it still a cyclops? I think most people would agree that no it is not. Therefore, having one eye is an invariant of the cyclops aggregate. It must be true for something to even have a chance of being a cyclops. Are there other invariants that must also be satisfied? Almost certainly! We would not call a cat with one eye a cyclops. We would probably only consider something to be a cyclops if it was also humanoid. Aha! Another invariant. We could repeat this process to eventual build up our exhaustive definition of what it means to be a cyclops. Notice, that there will also be many features of a cyclops that are not invariants. For example, what about the cyclop's hair colour, or its favourite food? Neither of these are invariants. A cyclops can have any hair colour (or even no hair) and still be considered a cyclops. This reflects the exhaustive nature of our list of invariants. These are the only deciders of whether something is a cyclops. If you satisfy them all, then you are cyclops no matter what other properties you possess. If there is even one you do not satisfy, then you are not.

Notice that we often implicitly apply invariants to our aggregates without thinking about it. A product's stock count has an integer type. It can never be a string. This invariant is enforced for us by our programming language when we assign the property a type. **if it has types!** Thus, aggregate invariants are simply these and the additional constraints we apply on top that we, rather than the language, are responsibly for enforcing.

Aggregate invariants are incredibly powerful and well worth the effort of enforcing at all times. By fixing the definition of the aggregate, any consumers making use of the aggregate can safely make assumptions about its structure and what properties it contains. They also protects us against having to write code to handle situations that would impossible in the real world and allow us to keep our code concise. Notice that as they provide the definition of an aggregate, these invariants can never span multiple aggregates. For this type of constraint, we must look to our second concept.

Business rules are the rules in force in the business domain you are working in. Crucially, they are not interested in enforcing the validity of an aggregate, instead they enforce whether an operation in your domain can take place. These may or may not be constraints involving a single aggregate or a combination of multiple. We strive to place the validation for these constraints next to the logic for performing the operation to which they relate, whether that is inside a method on an aggregate or inside a domain service.

Consider our ticket booking system. To book a child's ticket on our airline, the passenger must be less than 12 years old. Must all passengers be less than 12 years old? Of course not! This is a business rule that must be satisfied only in order to perform the operation of buying a child's ticket.

A couple of pointers for identifying which type of concept you are validating are as follows. Look for impossible cases in the real world that you are forced to validate. Look for repeated validation of these cases across your codebase. Both of these are hints that you have an aggregate invariant waiting to be extracted. Conversely, look for the "in order to..." statements in your domain. This is the telltale sign of a business rule. It does not make statements about the aggregate in general, it is purely concerned with validating whether a certain operation can happen.

**<Implementing aggregate invariants>**

* Discuss exceptions vs notifications

**<Implementing business rules>**

### References

[Microsoft - Design validations in the domain model layer](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations "Design validations in the domain model layer (Microsoft)")

[Jeffrey Palermo - The fallacy of the always valid entity](https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/  "The fallacy of the always valid entity (Jeffrey Palermo)")

[Los Techies - Validation in a DDD world](https://lostechies.com/jimmybogard/2009/02/15/validation-in-a-ddd-world/ "Validation in a DDD world (Los Techies)")

[Greg Young - Always valid](http://codebetter.com/gregyoung/2009/05/22/always-valid/ "Always valid (Greg Young)")

[Colin Jack - Domain Model Validation](https://colinjack.blogspot.com/2008/03/domain-model-validation.html "Domain Model Validation (Colin Jack)")

[Martin Fowler - Replacing Throwing Exceptions with Notification in Validations](https://martinfowler.com/articles/replaceThrowWithNotification.html "Martin Fowler")

[https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns](https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns "https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns")