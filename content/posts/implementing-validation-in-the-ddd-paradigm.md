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
I've recently joined a project early in its life and we're currently in the process of deciding our design approach for various components of the system. It's a very exciting project for me as we're trying to follow the principles of domain-driven design (DDD) as much as possible. Whilst I've read both the **blue book** and the **red book**, I must admit this is the first time I've worked on a project that is attempting to follow DDD, so this is largely a new landscape to me. Therefore, I figured it might be useful to write something about the various challenges we face along the way in the hope that it will offer some insight into the considerations we have been making as we grow the system out. With that in mind, let's roll our sleeves up and get started on the first topic... validation!

I think **this article from Microsoft** provides a great introduction to the discussion. They begin by explaining that the main responsibility of an aggregate is to ensure it is always in a valid state. Furthermore, an aggregate should protect itself from being made invalid. In practice, this would mean placing checks on any method they expose which changes their state and reject any changes that would cause them to become invalid. 

Let's explore this proposal a little more. Firstly, we need to settle on what we mean for an aggregate to be valid. We will soon see that there is some nuance to this definition, but for now let us come up with a simple first pass. Following the principles of DDD, let us first define an aggregate to be valid if it is in a state that is possible in the real world. 

For example, consider an inventory management system. This system may feature a product aggregate, containing a stock count property, which would store the number of items of that product left in stock. We would ask ourselves what values this stock count property could take. Hopefully it should be pretty apparent that the we would accept positive integers as a value. Similarly, we would accept zero to indicate that the product is out of stock. It would be nonsensical to accept negative integers, as we have no concept of having negative stock levels. Similarly, a fractional stock count would be meaningless in our domain. Therefore, we are led to the conclusion that our product aggregate is valid if its stock count is always a non-negative integer. 

Next, let's consider their statement that an aggregate should validate that it is always in a valid state. The reasoning why this should be the case should now be a little clearer. By enforcing that an aggregate is always valid, we protect callers of the aggregate against writing code to check for and handle cases that would not be possible in the real world. For example, consider the process of creating an order for some of our products in the previous paragraph and suppose our product aggregate does not ensure it is always in a valid state. Our domain expert has told us, quite rightly, that we should allow a customer to order a product if we have the product left in stock and reject the order if the stock count is zero. Without ensuring the product is valid, there are a couple of extra cases to consider here. What should we do if the stock count is negative? What should we do if the stock count is a fraction? If you posed  these questions to the domain expert, you would probably get little more answer than a baffled expression. These states are not possible in the real world. Therefore, given that our model should be an reflection of the real world domain, they should not be possible in our model either and we certainly should not being writing code to handle these states.

Furthermore, the article makes an interesting point about how we would test drive this order service in the case that our product aggregate is not always valid. In this case, our flawed product aggregate should be glaringly obvious. We would have to write tests of the form "given the stock count is negative, when we order the product, then ..." or "given the stock count is a fraction, when we order the product, then ...". How would we finish the test statements? Your guess is as good as mine.

A final point on this definition comes from the helpful DRY mnemonic. Suppose we have our not-always-valid product aggregate, but we have made the sensible decision that each caller of the aggregate should throw an InvalidStockCountException whenever the product has an invalid stock count. Well, as sensible as the handling code is, we have to repeat it across every caller of the product aggregate. In addition, we are increasing the likelihood of introducing bugs into our system by forgetting to add the handling code on each caller. Again, if the product aggregate enforced that it could never be in these states in the first place, each caller is saved from having to write duplicate handling code for these nonsensical states. Now, the callers become free to use the aggregate, safe in the knowledge that they only need to handle cases with real world meaning. 

Big DDD tick. Kinda.

I mentioned that our definition of valid was slightly nuanced. In fact, Jeffrey Palermo and Jimmy Bogard would argue that our first definition is missing a key dimension, the context against which we are determining validity.

In order to take out a new loan, a customer must have a valid credit check. In order to update a post on a blog, the user must have write permissions for that post. In order to pay an invoice, there already be a purchase order for the same amount. Domains are full of business rules about whether or not certain operations can be performed. Notice the additional phrase we add to these business rules. There is a difference between saying that a customer is valid if they have a valid credit check and saying a customer must have a valid credit check _in order to take out a loan_. We are not simply asking if a customer is valid, we are asking whether a customer can perform a certain operation. In the banking domain, you can still be a customer even if you don't have a valid credit check, you're just more restricted in the operations you can perform. This is the issue Jeffrey and Jimmy are raising with our initial definition. Jimmy writes

> Instead of answering the question, “Is this object valid?”, try and answer the question, “Can this operation be performed?**”**.

Let's explore this viewpoint a little more. Firstly, notice that many of these rules also involves conditions that must between across many different aggregates. These rules would not be very easy to fit into our current definition.

Consider an airline ticket booking system. We've designed our passenger aggregate, storing their passport number, their email address, and perhaps a few other properties. We've validated everything inside the aggregate and we're happily chugging along selling tickets to passengers, spamming them with booking confirmations and marketing content via email, blah blah blah. 

Until one day a new requirement comes along. The airline love our system so much they want to migrate their old legacy booking system over to our shiny, new one. This involves migrating all the passenger data over, but there's a catch. In the old system, it wasn't mandatory to store an email address against a passenger, but in our system it is. In fact, not only is an email address mandatory in our system, but we have functionality making use of that fact. So what can we do? Certainly, we don't want to remove the email spamming module. That's why everyone loves our app so much. As a workaround, perhaps we import the old passengers as a different aggregate, something like a LegacyPassenger. It's not a great solution; to any domain expert, a passenger is a passenger no matter which system they originated from, so we've had to make our model diverge from the domain, but whatever it works for now right? Erm, no.

Joanne's trying to book a ticket from Berlin to Cape Town to visit relatives. But that's a catch. She's a bit of a technophobe and she doesn't have an email address. What do we do now? Refuse to let her fly with our airline because unless she creates an airline ticket? Probably not a great business decision. Create a new aggregate for passengers without email addresses, a TechnophobicPassenger? Then, even current passengers would start being divided along contours which do not exist in the real world domain. Not very DDD-y.

This sounds very appealing to our ticket booking system. Now, our legacy passengers and all the Joannes of the world can still be classified as passengers using the same aggregate, just like they are in the real world domain. Rather than the passenger aggregate, it is now the responsibility of the email spamming module to confirm that a passenger has an email address. If a passenger doesn't have an email address, it is now up to the email spamming module to handle the passenger in the way it sees fit. It's probably no big deal, perhaps we try sending them our marketing detritus via post instead? Retro.

Well, apart from all our old issues come back. Everyone using the product aggregate now has to handle negative stock counts again. Greg Young offers the answer. They conclude that there is truth to both approaches. In fact, there are two distinct concepts we should be interested in validating.

1. Aggregate invariants
2. Business rules

Let's consider aggregate invariants first. This the concept we discusses first. Aggregate invariants are the definition of an aggregate. They are a list of defining characteristics that allow us to identify whether an object is an instance of our aggregate. Even if an object satisfies all but one aggregate invariants, it cannot be considered an instance of the aggregate.

Consider a cyclops with two eyes. Is it still a cyclops? I think most people would agree that no it is not. Therefore, having one eye is an invariant of the cyclops aggregate. It must be true for something to even have a chance of being a cyclops. Are there other invariants that must also be satisfied? Almost certainly! We would not call a cat with one eye a cyclops. We would probably only consider something to be a cyclops if it was also humanoid. Aha! Another invariant. We could repeat this process to eventual build up our exhaustive definition of what it means to be a cyclops. Notice, that there will also be many features of a cyclops that are not invariants. For example, what about the cyclop's hair colour, or its favourite food? Neither of these are invariants. A cyclops can have any hair colour (or even no hair) and still be considered a cyclops. This reflects the exhaustive nature of our list of invariants. These are the only deciders of whether something is a cyclops. If you satisfy them all, then you are cyclops no matter what other properties you possess. If there is even one you do not satisfy, then you are not.

Notice that we often implicitly apply invariants to our aggregates without thinking about it. A product's stock count has an integer type. It can never be a string. This invariant is enforced for us by our programming language when we assign the property a type. Thus, aggregate invariants are simply these and the additional constraints we apply on top that we, rather than the language, are responsibly for enforcing.

Aggregate invariants are incredibly powerful and well worth the effort of enforcing at all times. By fixing the definition of the aggregate, any consumers making use of the aggregate can safely make assumptions about its structure and what properties it contains. They also protects us against having to write code to handle situations that would impossible in the real world and allow us to keep our code concise. Notice that as they provide the definition of an aggregate, these invariants can never span multiple aggregates. For this type of constraint, we must look to our second concept.

Business rules are the rules in force in the business domain you are working in. Crucially, they are not interested in enforcing the validity of an aggregate, instead they enforcing whether an action in your domain can take place. These may or may not be constraints involving a single aggregate or a combination of multiple. We strive to place the validation for these constraints next to the logic for performing the operation to which they relate, whether that is inside a method on an aggregate or inside a domain service. 

Consider our ticket booking system. To book a child's ticket on our airline, the passenger must be less than 12 years old. Must all passengers be less than 12 years old? Of course not! This is a business rule that must be satisfied only in order to perform the operation of buying a child's ticket. 

Let's compare these two concepts.

* Aggregate Invariant
  * "Is it a valid instance of the aggregate?".
  * All invariants apply within the context of one aggregate only.
  * These invariants must always be satisfied.
  * We should validate these invariants on every mutation to the aggregate.
* Business Rule
  * "Can this operation be performed?"
  * Rules can apply within a single aggregate or between multiple aggregates.
  * Only need to be satisifed to perform the associated operation, not all aggregates will be in this state all the time.
  * We should validate these rules just before we perform the associated operation.

**<Implementing aggregate invariants>**

* Discuss exceptions vs notifications

**<Implementing business rules>**

* Discuss specifications

* Talk though these 4 articles as the intro.

  [Microsoft - Design validations in the domain model layer](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations "Microsoft") (Aggregate Invariants)

  [https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/](https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/ "https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/") (Business Rules)

  [Los Techies - Validation in a DDD world](https://lostechies.com/jimmybogard/2009/02/15/validation-in-a-ddd-world/ "Los Techies") (Business Rules)

  [Greg Young - Always valid](http://codebetter.com/gregyoung/2009/05/22/always-valid/ "Greg Young") (Business Rules + Aggregate Invariants)

[Martin Fowler - Replacing Throwing Exceptions with Notification in Validations](https://martinfowler.com/articles/replaceThrowWithNotification.html "Martin Fowler")

[https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns](https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns "https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns")

[Colin Jack - Domain Model Validation](https://colinjack.blogspot.com/2008/03/domain-model-validation.html "Colin Jack")