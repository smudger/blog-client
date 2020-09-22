---
tags:
- javascript
- gridsome
- jamstack
- netlify
- gatsby
- blog
title: New blog musings
author: Smudger
category: Blog
created_at: 2020-05-23T15:00:00.000+00:00
excerpt: For my inaugural post, it feels appropriate to talk about my experiences
  setting the blog up and I have to say the whole process couldn't have been easier.
is_live: true

---
For my inaugural post, it feels appropriate to talk about my experiences setting the blog up. I had been playing around with the idea of having a blog for a while, primarily to serve as a reference of interesting programming techniques that I discover along my travels through life as a developer. I was finally inspired to take action by a friend who had recently set up a company website in [Gatsby](https://www.gatsbyjs.org/ "GatsbyJs") and was discussing how enjoyable they had found the whole process.

I had a look into Gatsby and really liked what I saw. It looked easy to get started with, included a whole plethora of performance optimisations out of the box, and compiled down to a set of static files that could be hosted on a CDN for easy deployment. To a fresh, new Javascript developer like me it all sounded absolutely dreamy, apart from one small caveat. Gatsby is written for [React](https://reactjs.org/ "ReactJS").

Ok, so before anyone jumps down my throat, I have absolutely nothing against React. In fact, I would _love_ to learn React and use it in projects. However, currently I have zero experience with it and I'm very new to Javascript development in general. Therefore, I was hesitant to dive in with Gatsby, purely because it would involve learning React which I felt would slow me down more than I wanted to be and, like the classic Gen Z that I am, I craved that sweet instant gratification.

Now the existence of this blog confirms that all was not lost. As part of my investigation into Gatsby, my eyes were opened to the glorious world of [JAMstack](https://jamstack.org/ "JAMstack"). I discovered that Gatsby is just one of many frameworks implementing this mysterious new web stack. The JAMstack is simple, comprising only of some combination of Javascript, APIs and Markup. This allows sites using the stack to share one key feature. They don't rely on a web server. Turns out the benefits I had discovered in Gatsby were not unique to that framework. The principle of blazingly fast performance, not to mention scalability, by serving static files over a CDN was not a just a Gatsby thing, it was a JAMstack thing. My mind was made up, I wanted a piece of the action. Given my familiarity with [Vue](https://vuejs.org/ "VueJS") over React, my needs were simple; I wanted a framework using the stack that was supportive of Vue. Enter [Gridsome](https://gridsome.org/ "Gridsome").

Gridsome fulfilled my needs perfectly, offering the same benefits as Gatsby but supporting development in Vue, so it was an easy sell and as I write this post I have to say that I do not regret my decision one bit. Like Gatsby, it makes your content available to you via [GraphQL](https://graphql.org/ "GraphQL") which is another technology that I was very interested in learning, though I might save writing about that for another post. Similarly, it offers a wide variety of integrations that allow you to populate your GraphQL API from a multitude of different locations, whether that be locally from within your repository or further afield from popular CMSs like [WordPress](https://wordpress.com/ "WordPress") or [Drupal](https://www.drupal.org/ "Drupal"). Personally, I decided that to begin with I wanted to keep it simple, so I'm currently storing all my posts within the codebase itself, and using [Forestry](https://forestry.io/ "Forestry") to provide a _very_ pretty UI to edit them in.

In terms of hosting, I'm using [Netlify](https://www.netlify.com/ "Netlify") and have little to say because it's been so seamless. It took me no time at all to set up continuous deployment and everything just seemed to work first time so I'm one happy camper on that front.

Overall, I have to say that as this back-end developer's first foray into the world of front-end development, setting up this blog has been a hugely rewarding experience and I'm excited to see where I can go with it next. Watch this space for more vaguely programming-related ramblings and more about my journey into the wild world of the front-end! :)