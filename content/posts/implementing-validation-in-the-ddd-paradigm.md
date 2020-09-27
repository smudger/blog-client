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

I think [this article](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations "Design validations in the domain model layer (Microsoft)") from Microsoft provides a great introduction to the discussion. They begin by explaining that the main responsibility of an aggregate is to ensure it is always in a valid state. Furthermore, an aggregate should protect itself from being made invalid. In practice, this would mean placing checks on any method they expose which changes their state and reject any changes that would cause them to become invalid.

Let's explore this proposal a little more. Firstly, we need to settle on what we mean for an aggregate to be valid. We will soon see that there is some nuance to this definition, but for now let us come up with a simple first pass. Following the principles of DDD, let us first define an aggregate to be valid if it is in a state that is possible in the real world.

For example, consider an inventory management system. This system may feature a product aggregate, containing a stock count property, which would store the number of items of that product left in stock. We ask ourselves which values this stock count property could take. Hopefully it should be pretty apparent that the we should definitely accept positive integers as a value. Similarly, we would accept zero to indicate that the product is out of stock. It would be nonsensical to accept negative integers, as we have no concept of negative stock levels. Similarly, a fractional stock count would be meaningless in our domain. Therefore, we are led to the conclusion that our product aggregate is valid only if its stock count is always a non-negative integer.

Next, let's consider the statement that an aggregate should ensure that it is always in a valid state. The reasoning why this should be the case should now be a little clearer. By enforcing that an aggregate is always valid, we protect callers of the aggregate against writing code to check for and handle cases that would not be possible in the real world. For example, consider the process of creating an order for some of our products and suppose our product aggregate does not ensure it is always in a valid state. Our domain expert has told us, quite rightly, that we should allow a customer to order a product if we have the product left in stock and reject the order if the stock count is zero. Without ensuring the product is valid, there are a couple of extra cases to consider here. What should we do if the stock count is negative? What should we do if the stock count is a fraction? If you posed  these questions to the domain expert, you would probably get little more answer than a baffled expression. These states are not possible in the real world. Therefore, given that our model should be an reflection of the real world domain, they should not be possible in our model either and we certainly should not being writing code to handle these states.

Furthermore, the article makes an interesting point about how we would test drive the logic for creating an order in the case that our product aggregate is not always valid. In this case, the issues with a product not being valid should be glaringly obvious. How would we finish the statement of these test cases? Your guess is as good as mine. Furthermore, we would have to repeat this test cases across every piece of functionality making use of the stock count property on the product aggregate. Feels quite repetitive eh?

    void when_a_customer_orders_a_product_with_negative_stock_then_...() {
    	// TODO
    }
    
    void when_a_customer_orders_a_product_with_fractional_stock_then_...() {
    	// TODO
    }

Therefore, this idea of the always-valid aggregate seems like a good one. We've reduced repetition in both our production code and our test cases, and we're less likely to introduce bugs as a result of forgetting to check for these nonsensical cases. Callers of our aggregate are free to use the aggregate, safe in the knowledge that they only need to handle cases with real world meaning.

Big DDD tick. Kinda.

I mentioned that our definition of valid was slightly nuanced. In fact, Jeffrey Palermo and Jimmy Bogard would argue that our first definition is missing a key dimension, the context against which we are determining validity.

In order to take out a new loan, a customer must have a valid credit check. In order to update a post on a blog, the user must have write permissions for that post. In order to pay an invoice, there already be a purchase order for the same amount. Domains are full of business rules about whether or not certain operations can be performed. Notice the additional phrase we add to these business rules. There is a difference between the statement that a customer is valid if they have a valid credit check and the statement that a customer must have a valid credit check _in order to take out a loan_. We are no longer concerned with the validity of an aggregate, rather we are interested in whether that aggregate can perform a certain operation. In the banking domain, you can still be a customer even if you don't have a valid credit check, you're just more restricted in the operations you can perform. This is the issue Jeffrey and Jimmy are raising with our initial definition. Jimmy writes the following.

> Instead of answering the question, “Is this object valid?”, try and answer the question, “Can this operation be performed?”.

Furthermore, they argue that the validation to answer this type of question belongs next to the operation they are validating, whether that occurs as a method on the aggregate or in an external service. Let's explore this viewpoint a little more. 

Consider an airline ticket booking system. We've designed our passenger aggregate, storing their passport number, their email address, and perhaps a few other properties. We've validated everything inside the aggregate and we're happily chugging along selling tickets to passengers, spamming them with booking confirmations and marketing content via email, blah blah blah.

Until one day, our system encounters Joanne. Joanne's trying to book a ticket from Berlin to Cape Town to visit relatives. But there's a catch. She's a bit of a technophobe and doesn't have an email address. In our initial pass at validation, this is a bit of an issue. Our passenger aggregate always needs an email address. So what can we do? Refuse to let her fly with our airline unless she creates an email address? Probably not a great business decision. Create a new aggregate for passengers without email addresses, a TechnophobicPassenger? Not great either, as we've now created a division amongst types of passengers due to constraint of our system rather than because of a division that exists in the real world domain. Not very DDD-y.

Conversely, consider the alternative approach. We ask ourselves why our passenger aggregate needs to have an email address. The only part of our system that actually makes use of the passenger's email address is our email module. Therefore, our statement that "a passenger is valid only if it has an email address" becomes the far more illuminating business rule that "in order to send a booking confirmation, the passenger must have an email address." Furthermore, as this constraint is only required for the email module we can shove the validation logic in there, next to where it is actually relied upon, and move it out of the passenger aggregate.

This sounds very appealing to our ticket booking system. Now, all the Joannes of the world can still be classified as passengers using the same aggregate, just like they are in the real world domain. Sure, we can't send them their booking confirmation by email, but maybe we can ask them to pick it up at the airport instead or even send it by post. Retro. 

What we've discovered are that actually our system has two distinct concepts worthy of validation. This also is viewpoint Greg Young concludes. In our first case, we have aggregate invariants. These are the invariants so fundamental to the definition of the aggregate that it would be frustrating and repetitive to have to repeat their validation across every caller of the aggregate. Secondly, we have business rules. These rules are phrased in the context of operations and define whether the operation can go ahead. Let's expose each one in turn.

Let's consider aggregate invariants first. We consider these to be the definition of an aggregate. They are a list of defining characteristics that allow us to identify whether an object is truly an instance of our aggregate. Even if an object satisfies all but one aggregate invariant, it cannot be considered an instance of the aggregate.

Consider a cyclops with two eyes. Is it still a cyclops? I think most people would agree that no it is not. Therefore, having one eye is an invariant of the cyclops aggregate. It must be true for something to even have a chance of being a cyclops. Are there other invariants that must also be satisfied? Almost certainly! We would not call a cat with one eye a cyclops. We would probably only consider something to be a cyclops if it was also humanoid. Aha! Another invariant. We could repeat this process to eventual build up our exhaustive definition of what it means to be a cyclops. Notice, that there will also be many features of a cyclops that are not invariants. For example, what about the cyclop's hair colour, or its favourite food? Neither of these are invariants. A cyclops can have any hair colour (or even no hair) and still be considered a cyclops. This reflects the exhaustive nature of our list of invariants. These are the only deciders of whether something is a cyclops. If you satisfy them all, then you are cyclops no matter what other properties you possess. If there is even one you do not satisfy, then you are not.

Notice that we often implicitly apply invariants to our aggregates without thinking about it. A product's stock count has an integer type. It can never be a string. This invariant is enforced for us by our programming language when we assign the property a type. Thus, aggregate invariants are simply these and the additional constraints we apply on top that we, rather than the language, are responsibly for enforcing.

Aggregate invariants are incredibly powerful and well worth the effort of enforcing at all times. By fixing the definition of the aggregate, any consumers making use of the aggregate can safely make assumptions about its structure and what properties it contains. They also protects us against having to write code to handle situations that would impossible in the real world and allow us to keep our code concise. Notice that as they provide the definition of an aggregate, these invariants can never span multiple aggregates. For this type of constraint, we must look to our second concept.

Business rules are the rules in force in the business domain you are working in. Crucially, they are not interested in enforcing the validity of an aggregate, instead they enforce whether an operation in your domain can take place. These may or may not be constraints involving a single aggregate or a combination of multiple. We strive to place the validation for these constraints next to the logic for performing the operation to which they relate, whether that is inside a method on an aggregate or inside a domain service.

Consider our ticket booking system. To book a child's ticket on our airline, the passenger must be less than 12 years old. Must all passengers be less than 12 years old? Of course not! This is a business rule that must be satisfied only in order to perform the operation of buying a child's ticket.

A couple of pointers for identifying which type of concept you are validating are as follows. Look for impossible cases in the real world that you are forced to validate. Look for repeated validation of these cases across your codebase. Both of these are hints that you have an aggregate invariant waiting to be extracted. Conversely, look for the "in order to..." statements in your domain. This is the telltale sign of a business rule. It does not make statements about the aggregate in general, it is purely concerned with validating whether a certain operation can happen.

**<Implementing aggregate invariants>**

* Discuss exceptions vs notifications

**<Implementing business rules>**

###### References

[Microsoft - Design validations in the domain model layer](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations "Microsoft") 

[Jeffrey Palermo - The fallacy of the always valid entity](https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/  "The fallacy of the always valid entity (Jeffrey Palermo)")

[Los Techies - Validation in a DDD world](https://lostechies.com/jimmybogard/2009/02/15/validation-in-a-ddd-world/ "Los Techies") 

[Greg Young - Always valid](http://codebetter.com/gregyoung/2009/05/22/always-valid/ "Greg Young") 

[Martin Fowler - Replacing Throwing Exceptions with Notification in Validations](https://martinfowler.com/articles/replaceThrowWithNotification.html "Martin Fowler")

[https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns](https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns "https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns")

[Colin Jack - Domain Model Validation](https://colinjack.blogspot.com/2008/03/domain-model-validation.html "Colin Jack")