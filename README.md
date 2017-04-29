# Closing the loop: why TypeScript and React are a superheroic dynamic duo

or, the joy of tool-assisted typesafe frontend web development

### ***!important update!!!* this post is *already outdated* and full of FUD - that's JavaScript fatigue for ya! :squirrel:**
> I failed to anticipate that Angular and other frameworks could theoretically parse
> their string templates and integrate with the TypeScript language service,
> and get some (or all?) of the benefits that React enjoys.
> It was just [announced](https://blogs.msdn.microsoft.com/typescript/2017/04/27/announcing-typescript-2-3/)!
> This at least partially invalidates this article's comparison of React to Angular, Vue,
> and others via its new
> [language service plugin API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API).
> I don't know if string templates can ever be as fully typechecked as React can be,
> but maybe they can (please open an issue if you know) - in any case, this is super cool!
> I'm going to post a followup to this article with some snappy Angular animations,
> and maybe more - [GraphQL](https://github.com/Quramy/ts-graphql-plugin)? Yes please.

React and TypeScript are well-hyped fixtures of the 2017 webscape,
but not much attention has been given to how wonderfully they complement each other.
This article and attached code demonstrate why I prefer
building my views with TypeScript in React
over the templating strategies used by other popular view libraries.

> tldr: React builds DOM and listens to it in a way that can be typechecked.
> This simple fact provides substantial benefits over alternatives that use string templates.
> Read on for more discussion and visual demonstrations.
> This is the joy of tool-assisted typesafe frontend web development:
>
> `great web libraries/frameworks -> types -> great editor integration -> much productivity`

What follows is a whole lot of words that explain
what "the loop" is and why we want it to be "closed",
then some demo code visuals illustrating the point.
Feel free to skip down to the pretty pictures.

## What is "the loop?"
React has promoted a now well-known concept called *unidirectional data flow*,
which has been adopted by Angular 2, Ember 2, the React community via Flux and Redux,
the Vue community via Vuex, and many others.
This contrasts with the *bidirectional data flow* or *two-way data binding*
used in Angular 1, Ember 1, Vue 1, and Knockout, among others.

There are a lot of
[great resources](https://staltz.com/unidirectional-user-interface-architectures.html)
that explain unidirectional data flow,
and some basic understanding is important for the rest of this article.
The gist is that it describes how data can flow through
a client application in a circular one-way loop -
starting with some state, then building the UI views from that data,
then reacting to user input events on the views,
which triggers business logic to update the state,
then re-drawing the views with the new state, and continuing on in a loop.
There's more to it, but this is the basic loop:
```
  state -> view -> user input -> business logic -> new state -> new view -> ...
```

## What is a "closed" loop?
At each step of the loop, we process data sent by the previous step.
In JavaScript, the correctness of passing and processing data can only be tested at runtime,
and static analysis has tight limits.
In contrast, TypeScript and other typed languages are able to check more of the validity
of each step at *compile* time because of the additional information provided by types.
For the purposes of this article, I'm going to refer to a fully typechecked loop as *closed* -
meaning *all* type errors will be caught by the compiler *throughout the loop*.

> My apologies if the term "closed loop" irks you or makes no sense -
> please submit an issue with suggestions!
> I felt that existing terminology doesn't capture the importance of this concept
> in the context of single page web apps.

The benefits of having a fully typechecked *closed loop*
go far beyond disambiguating strings and numbers.
A closed loop means all of the symbols in your app -
every reference to each variable, function, and piece of data -
has a type and *set of relationships* that the compiler understands.
A fully closed loop makes it *impossible* for typos, missed refactorings,
and all other mechanical errors to slip through unnoticed.
In a closed loop, the compiler has your back - all of it.

> Side note: TypeScript + React cannot currently be 100% fully typechecked,
> but it's close, and each big update brings it closer.
> The TypeScript team has paid special attention to supporting React's patterns.
> For example they support a typed version of JSX called TSX,
> and you'll find many references to React in the TypeScript issues.
> Though TypeScript + React is imperfect - there are small type gaps here and there,
> and some things require type annotations that should be unnecessary -
> the point of this article still stands.
> Don't let perfect be the enemy of good, let alone great!
> Be sure to check out TypeScript's optional compiler flags that increase type strictness,
> like `noImplicitAny` and `strictNullChecks`.
> The experienced TypeScript developer will likely find and prefer
> patterns that work well with its type system,
> while keeping in mind that type-induced design damage could be a thing.
> One of TypeScript's greatest strengths is that you can easily opt out of its rules at any time,
> but be wary of breaking the loop!

Error checking is only one part of the story.
Types also provide the computer with a significantly improved understanding of your code.
This empowers the computer to do far more than check for errors -
from code navigation, to inspecting where and how which symbols get used,
to making automated transformations and refactorings, there's so much the computer can do for us.

Sounds pretty good right?
The caveat is that the loop needs to be *closed* to provide a great experience.
The computer can only do these things with confidence when it has complete type information.
Any broken steps in the loop will cause things to fall through the cracks,
meaning you cannot rely on the automated information and transformations
the computer provides you with.
Say you ask the computer to rename a variable -
if your views do not close the loop, you'll have to search all of your views and
update the variable name without the computer's assurances of validity.
This is tedious and error prone - consider renaming a property named `text` in a huge app!
If there can always be leaks and misses, you have to check everything manually,
and fearless refactoring flies out the window.
A closed loop enables higher productivity for reading code, writing code,
and improving and maintaining code quality over time,
which leads to happier developers, happier users, and better business outcomes.

> I'll speculate that many developers think TypeScript adds rigidity to your code.
> I think it's the opposite - JavaScript code is more rigid, and TypeScript more fluid,
> because it's so easy, quick, and safe to refactor TypeScript.
> However it is true that TypeScript can lead you to constrain your APIs,
> contrary to the philosophy of libraries like jQuery where API flexibility is praised.
> The TypeScript team has done an outstanding job designing the type system
> to fit the semantics and patterns of JavaScript,
> and although it cannot model every JS library's API,
> in practice I rarely feel limited,
> and I've found that I prefer explicit contracts over functions that magically work with any input.


## Closing the loop in practice
So a closed loop sounds great - how do we get one?
It turns out that the *view* is where most loops get broken
in the single page web apps of 2017.
This is where React differs from most other popular view libraries and frameworks.
If you can build your views with a typed flavor of JavaScript, like TypeScript,
you can close that part of the loop! That's what React offers.
Most view libraries do not allow building views with JavaScript,
and even though some libraries like Vue offer this
as an alternative to string templates,
they still miss critical aspects of type safety, and the vast majority
of the code in those communities has zero type safety in templates.
Let's look at some popular frameworks and their loops with TypeScript.

> `--->` is a fully typechecked closed step and `-/->` is a step
> that breaks the loop by losing type information

Angular 2+, Vue, and Ember have two broken steps in the loop.
To see what this actually means in practice, skip down to the last of the images below.
```
  state -/-> view -/-> user input ---> business logic ---> state
```

Cycle gets closer, but it prefers CSS selector strings for attaching user input handlers to the view:
```
  state ---> view -/-> user input ---> business logic ---> state
```

React is a closed loop - no broken steps!
```
  state ---> view ---> user input ---> business logic ---> state
```

Elm, PureScript, and some other languages with advanced type systems
are able to get closer to a 100% fully typechecked closed loop than TypeScript can today,
but they come with significant added friction to interoperating with the JavaScript ecosystem.
This is not a tradeoff I'm willing to to make for most large applications.

Enough telling - seeing is believing!

## Developing with a closed loop
The following images demonstrate things that are
only possible with a partially or fully closed loop.
To try these things yourself, clone this repo,
fire up your favorite editor with TypeScript integration
(vscode is pictured, Atom is great too),
and start moving fast without breaking things!

### Comprehensive error checking
![Comprehensive error checking](/img/comprehensive-error-checking.gif?raw=true)

### Rename symbol
![Rename symbol](/img/rename-symbol.gif?raw=true)

### Go to definition
![Go to definition](/img/go-to-definition.gif?raw=true)

### Autocomplete
![Autocomplete](/img/autocomplete.gif?raw=true)

### Pointer hover types
![Pointer hover types](/img/pointer-hover-types.gif?raw=true)

### Find all references
![Find all references](/img/find-all-references.gif?raw=true)

### Angular's broken loop
In Angular, notice how the computer
doesn't help with simple typos on the component or template,
despite having first-class integration with TypeScript.
None of the above demos work with Angular templates.
![Angular 2](/img/angular.gif?raw=true)


## Conclusion
Though imperfect, the TypeScript and React duo
provide a wonderful development experience, relative to most alternatives.
My hope is that more languages, libraries, and frameworks take seriously the idea that
we can and should be able to *close the loop*, because a fully typechecked app is a happy app.
We all need heroes - not to worship, but for their leadership -
and today, for front end web development, React and TypeScript are two of mine.


## Additional notes
Can you do all of this with Flow, the Facebook equivalent of TypeScript?
Maybe! I don't know.
The last time I evaluated Flow was over a year ago,
and though it has some useful type features that TypeScript doesn't
(like [$diff](https://flow.org/en/docs/types/utilities/)...yet?),
the overall development experience, especially editor support and community type definitions,
was not as mature as what TypeScript offered.
Competition is good for us the users,
and it seems Flow has helped motivate significant improvements
to TypeScript, like `strictNullChecks`.
If you're already transpiling your JavaScript, like with Babel,
it's a modest additional cost to adopt a gradual typing technology like TypeScript or Flow.
Hopefully I've convinced you to try a typed language that compiles to JS if you haven't already!

This article is from a programmer's perspective -
designers and others may have different priorities.
My primary concerns are code maintenance, correctness, and comprehension,
all of which contribute directly to productivity,
particularly when working on a team or a long-lived project.
I may look at a framework and see a broken loop,
but others may see a more concise, familiar,
and approachable framework compared to React and TypeScipt.
It's important to understand the tradeoffs,
and hopefully this article communicates just how much the computer
can help us accomplish our goals with the right tools.

Are React and TypeScript flawless? Oh heck no! Are any big software projects?
But in my opinion, relative to other solutions,
they're good - and together, for building UIs, they're *great*.
The future may hold something even better.
I'm watching WebAssembly eagerly, and I think BuckleScript+Ocaml/Reason have a shot
at winning a lot of developers from TypeScript/Flow in the next year or two.
Elm and PureScript are also interesting alternatives.

My path to TypeScript began with a linter.
I was amazed at how many errors and inconsistencies linters could find,
increasingly so in the past several years of tool evolution,
and TypeScript was a natural next step.
(`JSLint -> JSHint -> ESLint -> TypeScript + TSLint + ESLint`... fatigued?
nope, energized! these tools have saved me a lot of time)
I was already transpiling my code from commonjs modules and ES6 -
at that point, the cost of adopting TypeScript was quite small
(change the file extension, pop in the compiler),
and the benefits have been tremendous.
Thank you, Microsoft and the TypeScript team,
you've improved my productivity and happiness with your contributions,
and they're all open source!

My path to React started with jQuery and then Backbone,
where my team used a beautifully terrible templating system
that used JavaScript function calls to build views as strings.
(it looked alright in CoffeeScript, but never again)
When React was announced, and after I was desensitized enough
to get over my initial revulsion of JSX,
it became clear that it had all of the same benefits *and more* with none of the downsides.
I've since explored a lot of other frameworks, but React's paradigm remains my preference.
Thanks Facebook and the React team!


## Feedback welcome
Did I make an error, use cringey terminology,
misrepresent your favorite library, or miss an important point?
Please open an issue!
