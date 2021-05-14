# Closing the loop
### types + language service = awesome frontend webdev

> In the original version of this article, I mistakenly praised the capabilities
> of React compared to Angular, Vue.js, Ember, and other non-JS-based templating frameworks.
> As it turns out, tools don't care whether you put
> your code in your templates or the other way around.
> The day after I published this,
> [TypeScript 2.3 announced](https://blogs.msdn.microsoft.com/typescript/2017/04/27/announcing-typescript-2-3/)
> the stable release of the 
> [language service plugin API](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API),
> which allows other frameworks to get similar TypeScript tooling benefits that React enjoys.
> I was wrong to say React was unique in this way,
> and almost perfectly mistimed my post, and I'm sorry if I misled you.
> Here's a [great talk](https://www.youtube.com/watch?v=ez3R0Gi4z5A) explaining
> how Angular leverages types and the language service.
> This article has been updated to clarify that React
> enjoys no special ability to take advantage of type information.

React and TypeScript are well-hyped fixtures of the 2017 webscape,
but not much attention has been given to how wonderfully they complement each other.
This article and attached code demonstrate what's possible
in your editor when your code is fully typechecked on the frontend.
React views are written in either JavaScript or JSX, which is also just JavaScript,
so React can take advantage of types without special tooling,
but the TypeScript language service allows other frameworks
like Angular and Vue.js to enjoy similar benefits.

What follows is a whole lot of words that explain
what "the loop" is and why we want it to be "closed",
then some demo code visuals illustrating the point.
Feel free to skip down to the pretty pictures.

## What is "the loop?"
React has promoted a now well-known concept called *unidirectional data flow*,
which has been adopted by Angular 2, Ember 2, the React community via Flux and Redux,
the Vue.js community via Vuex, and many others.
This contrasts with the *bidirectional data flow* or *two-way data binding*
used in Angular 1, Ember 1, Vue.js 1, and Knockout, among others.

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
In JavaScript, code that passes and processes data can only be tested at runtime,
and static analysis has tight and fuzzy limits.
In contrast, TypeScript and other typed languages are able to check more of the validity
of each step at *compile* time because of the additional information provided by types.
For the purposes of this article, I'm going to refer to a fully typechecked loop as *closed* -
meaning *all* type errors will be caught by the compiler *throughout the loop*,
for some handwavy definition of "type error".

> My apologies if the term "closed loop" irks you or makes no sense -
> please submit an issue with suggestions!
> I felt that existing terminology doesn't capture the importance of this concept
> in the context of single page web apps.
> Also a caveat: nothing here should be considered valid computer science.
> Some words with domain-specific meaning may get muddled ahead.

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
> I'm sure future tooling will make all of this appear quite barbaric,
> but it's a major improvement over webdev circa 2012.
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
to making automated transformations and refactorings,
there's so much the computer can do for us,
which for me translates directly into productivity and happiness.

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
Worse still, your ability to understand the codebase shrinks as your app and team grow.
A closed loop enables higher productivity for reading code, writing code,
and maintaining and improving code quality over time,
which leads to happier developers, happier users, and better software.

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
Err, well, that was true until Microsoft introduced the
[language service](https://github.com/Microsoft/TypeScript/wiki/Using-the-Language-Service-API),
enabling deep integration between a typed host language,
the code inside templates, and your editor.

Authoring views is where React differs from most other popular libraries and frameworks.
If you can build your views with a typed flavor of JavaScript, like TypeScript,
you can close the parts of the loop that connect with the views
without a framework-specific language service,
and this is where React has a head-start.
Let's look at some popular frameworks that use
string-based templating and their loops.

The following diagrams **do not necessarily imply shortcomings**
of the frameworks relative to React -
they were originally falsely diminishing in the first version of this article,
but I think they still show how helpful type information
can be in single page apps.

> `--->` is a fully typechecked closed step and `-/->` is a step
> that breaks the loop by losing type information

Without integrating with a language service,
Angular 2+, Vue.js, and Ember have two broken steps in the loop.
Here are the VSCode plugins for
[Angular](https://github.com/angular/vscode-ng-language-service),
[Vue.js](https://github.com/octref/vetur/),
and [Ember](https://github.com/emberwatch/vscode-ember).
```
  state -/-> view -/-> user input ---> business logic ---> state
```

Cycle.js gets closer, but it prefers CSS selector strings
for attaching user input handlers to the view.
I don't doubt that some clever tools could staticly
analyze the relationships between views and input handlers,
but they don't appear to exist today.
```
  state ---> view -/-> user input ---> business logic ---> state
```

React is a closed loop by default, and doesn't need special tooling
to integrate with the language service - there are no broken steps!
This is a major reason why it has been adopted
by users of typed languages like PureScript and Reason/OCaml.
```
  state ---> view ---> user input ---> business logic ---> state
```

Elm, PureScript, and some other languages with advanced type systems
are able to get closer to a 100% fully typechecked closed loop than TypeScript can today,
but they come with significant added friction to interoperating with the JavaScript ecosystem.
This is not a tradeoff I'm willing to to make for most large applications, but YMMV.

Enough telling - seeing is believing!

## Developing with a closed loop
The following images demonstrate things that are
only possible with a partially or fully closed loop
and good editor integration.
To try these things yourself, clone this repo,
fire up your favorite editor with TypeScript integration
(VSCode is pictured, Atom is great too),
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

### Angular's language service integration
It's not currently as complete as the React+TypeScript experience,
but Angular has partial language service integration directly in HTML files,
linking types between templates and components.
I don't see any reason why it won't be as good as React's with more time.
![Angular 2](/img/angular.gif?raw=true)


## Conclusion
Types make working with frontend code a breeze,
once you have good editor integration.
Today's tools only scratch the surface of what's possible..

Though imperfect, TypeScript provides a wonderful development experience, relative to most alternatives.
My hope is that more languages, libraries, and frameworks take seriously the idea that
we can and should be able to *close the loop*, because a fully typechecked app is a happy app.


## Additional notes
Can you do all of this with Flow, the Facebook competitor to TypeScript?
Maybe! I don't know.
The last time I evaluated Flow was years ago, *(edit: see update below)*
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
**update:** I used Flow for a couple weeks in mid-2017, and I found
the overall experience to be much less helpful and complete than TypeScript's.
It has a theoretically more robust type system (see "soundness")
but my experience tells me that TypeScript's leaning towards practicality,
along with its maturity and popularity, make it a far better choice for me right now.

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
The future will surely bring more evolution and new tools.
I'm watching WebAssembly eagerly, and I think BuckleScript+OCaml/Reason have a shot
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

[CC-BY-NC-SA-4.0](license)