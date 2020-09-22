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
It feels like there are two types of validation we would consider:  
(1) Model invariants (inside an aggregate, entity or value object)  
(2) Domain rules (inside or outside the aggregate, entity or value object)

**Model Invariants** - These are conditions on a model which must always be true for it to be a valid model. These invariants enforce the static state of each model within your system - “Is it valid?” If they don’t meet the condition then they can’t be considered an instance of the model for our domain. You must protect against the model being created in an invalid state or changed to become in an invalid state. Therefore, we would validate these invariants in the constructor and as part of any method on the model that mutates it.  
e.g. an Address class, it must always have an address line 1 and a post code, if either of these are missing, it is not an address. The Address class itself protects its constructor and update postcode / address 1 methods to prevent itself from becoming invalid. Duplicate tests across different use cases of the form "an_address_with no line 1..." _don’t need to be written because they are not possible and nonsensical._

**Domain rules** - These are rules defined by the business domain you are working in. They enforce whether certain changes / actions / commands can take place within your domain - “Can this operation be performed?” These may or may not be constraints on an individual object or a combination of multiple objects. These constraints must be checked before performing the operation to which they relate. This happens wherever the operation itself happens, whether that is inside a method on a model or inside a domain service.  
e.g. Selling bus tickets to a passenger. The passenger must be over 12 years old. Before selling the bus ticket we check that the passenger is above 12 years old and reject if they are not. This domain rule only affects one model but it is not a model invariant because it is valid for a passenger to not be above 12 years old in general (lots of passengers will be), but it is only invalid to sell tickets to them - it is only invalid in the context of this operation. Similarly, you could imagine not selling a season ticket to any passengers that do not have an address, we would not make having an address a model invariant because you can be a passenger and not have an address, it is only invalid in the context of selling you season tickets. You can easily apply this to constraints across multiple models / aggregates.

[Martin Fowler - Replacing Throwing Exceptions with Notification in Validations](https://martinfowler.com/articles/replaceThrowWithNotification.html "Martin Fowler")

[Microsoft - Design validations in the domain model layer](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations "Microsoft")

[Los Techies - Validation in a DDD world](https://lostechies.com/jimmybogard/2009/02/15/validation-in-a-ddd-world/ "Los Techies")

[Colin Jack - Domain Model Validation](https://colinjack.blogspot.com/2008/03/domain-model-validation.html "Colin Jack")