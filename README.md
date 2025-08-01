<p>
  <a href="https://github.com/elos-lang/elos">
    <img width="150" src="https://raw.githubusercontent.com/elos-lang/elos/main/logo.png">
  </a>
</p>

## Build HTML emails, but without the torture

Crafting HTML emails has always been a pain—inline styles, inconsistent 
rendering across email clients, and a sea of outdated quirks to navigate. 
ELOS changes that.

ELOS is a declarative, developer-friendly language designed specifically for 
building responsive, accessible, and beautifully branded HTML emails. Forget about 
manually wrestling with tables and obscure CSS hacks—ELOS abstracts the complexities, 
letting you focus on design and content while ensuring rock-solid email compatibility.

### With ELOS, you get:
✅ Simplified Syntax – Write structured, readable code that compiles into bulletproof HTML.<br />
✅ Smart Defaults – No more worrying about missing styles or broken layouts.<br />
✅ Reusable Components – Build once, reuse everywhere.<br />
✅ Responsive by Default – Emails that look great on any device, without extra hassle.<br />

Say goodbye to email development torture and hello to ELOS.

## Getting started

### Option 1) Install the language

```bash
npm install elos
```

```bash
elos <input-file> [output-file]
```

### Option 2) Use with a build tool
- Use with Vite: [vite-plugin-elos](https://github.com/elos-lang/vite-plugin-elos)

## Contribution
See [Contributing Guide](CONTRIBUTING.md).

## License
[MIT](LICENSE)

## Roadmap v1
- Error improvements:
  - Throw an Error on accessing undefined variable
- Primitives:
  - Use Expressions where applicable
    - **TODO:**
      - ~~DefNode~~
      - ~~TxtNode~~
      - ~~ImgNode~~
  - ~~Variables~~
  - ~~String~~
  - ~~Number~~
  - ~~Colors~~
- ~~Single-line comments~~
- Improved (cleanup) styling system
  - Basic inheritance (extend from node style): selector "group.intro" extends from "group"
- Syntax improvements (consistency):
  - ~~Every node that has a block body should use { } (e.g. cols)~~
- 100% test coverage

## Roadmap v2
- Full templating support:
  - Conditionals
  - Loops (for, forEach)
  - Advanced primitives: lists, maps

## Getting started

### Language design example
```
def $preview "Welcome to ELOS Language!"
def $width 750
def $hgap 25
def $vgap 25

include "includes/style"

// this is a single-line comment

style txt.title {
	size 50
	color "#f14000"
}

body {
    img "https://placehold.co/600x250" -> "https://www.elos-lang.com"
    space
    txt.hero "ELOS Language" -> "https://www.elos-lang.com"
    space
    cols {
        col {
            include "includes/card" (
                $title "Card 1",
                $description "Description card 1",
                $url "https://www.elos-lang.com",
                $btnText "Nice!"
            )
        }
        col {
            include "includes/card" (
                $title "Card 2",
                $description "Description card 1",
                $url "https://www.elos-lang.com",
                $btnText "Read docs"
            )
        }
    }
    space
    group {
        cols {
            col {
                include "includes/card"
            }
            col {
                include "includes/card"
            }
        }
    }
    group.footer {
        txt "Footer"
    }
}
```