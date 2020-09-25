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

**<Talk through the articles >**

Talk though these 4 articles as the intro.

[Microsoft - Design validations in the domain model layer](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations "Microsoft") (Aggregate Invariants)

[https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/](https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/ "https://jeffreypalermo.com/2009/05/the-fallacy-of-the-always-valid-entity/") (Business Rules)

[Los Techies - Validation in a DDD world](https://lostechies.com/jimmybogard/2009/02/15/validation-in-a-ddd-world/ "Los Techies") (Business Rules)

[Greg Young - Always valid](http://codebetter.com/gregyoung/2009/05/22/always-valid/ "Greg Young") (Business Rules + Aggregate Invariants)

This led us to the conclusion that there are two separate concepts we should be interested in validating:

1. Aggregate invariants
2. Business rules

Let's consider aggregate invariants first. These are the defining characteristics of an aggregate. If even one of these conditions is not satisfied by an object, that we cannot consider it to be an instance of the aggregate. Conversely, as long as an object meets all of the conditions, it is an instance of the aggregate by definition. I think my favourite example to illuminate this comes from **Greg Young**'s article.

Consider a cyclops with two eyes. Is it still a cyclops? I think most people would agree that no it is not. Therefore, having one eye is an invariant of the cyclops aggregate. It must be true for something to even have a chance at being a cyclops. Are there other invariants that must also be satisfied? Almost certainly! We would not call a cat with one eye a cyclops. We would probably only consider something to be a cyclops if it was also humanoid. Aha! Another invariant. We could repeat this process to eventual build up our exhaustive definition of what it means to be a cyclops. Notice, that there will also be many features of a cyclops that are not invariants. For example, what about the cyclop's hair colour, or its favourite food? Neither of these are invariants. A cyclops can have any hair colour (or even no hair) and still be considered a cyclops. This reflects the exhaustive nature of our list of invariants. These are the only deciders of whether something is a cyclops. If you satisfy them all, then you are cyclops no matter what other properties you possess. If there is even one you do not satisfy, then you are not.

These aggregate invariants are incredibly powerful. By fixing the definition of the aggregate, any consumers making use of the aggregate can safely make assumptions about its structure and what properties it contains. This also protects us against having to write code to handle situations that would impossible in the real world.

**<Example of nonsensical test/method "if a cyclops has two eyes then ...">**

**<Talk about how this test would have to be repeated>**

**<This gives us the restriction that we must ensure that the invariants are always satisfied, protect the constructor and the update methods>**

**Domain rules** - Within an aggregate or spanning multiple aggregates. These are rules defined by the business domain you are working in. They enforce whether certain changes / actions / commands can take place within your domain - “Can this operation be performed?” These may or may not be constraints on an individual object or a combination of multiple objects. These constraints must be checked before performing the operation to which they relate. This happens wherever the operation itself happens, whether that is inside a method on a model or inside a domain service.  
e.g. Selling bus tickets to a passenger. The passenger must be over 12 years old. Before selling the bus ticket we check that the passenger is above 12 years old and reject if they are not. This domain rule only affects one model but it is not a model invariant because it is valid for a passenger to not be above 12 years old in general (lots of passengers will be), but it is only invalid to sell tickets to them - it is only invalid in the context of this operation. Similarly, you could imagine not selling a season ticket to any passengers that do not have an address, we would not make having an address a model invariant because you can be a passenger and not have an address, it is only invalid in the context of selling you season tickets. You can easily apply this to constraints across multiple models / aggregates.

**<Compare and contrast the two concepts>**

* Aggregate Invariant
  * Is it a ...?
  * Within an aggregate
  * Always true
  * Check on every mutation to the aggregate
* Business rules
  * Can this operation be performed?
  * Within or between multiple aggregates
  * Only need to be true in the context of one operation, not all aggregates will be in this state all the time
  * Check when you are about to perform the operation

**<Implementing aggregate invariants>**

* Discuss exceptions vs notifications

**<Implementing business rules>**

* Discuss specifications

[Martin Fowler - Replacing Throwing Exceptions with Notification in Validations](https://martinfowler.com/articles/replaceThrowWithNotification.html "Martin Fowler")

[https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns](https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns "https://www.codeproject.com/Tips/790758/Specification-and-Notification-Patterns")

[Colin Jack - Domain Model Validation](https://colinjack.blogspot.com/2008/03/domain-model-validation.html "Colin Jack")