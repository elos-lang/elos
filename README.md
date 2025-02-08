<p>
  <a href="https://github.com/elos-lang/elos">
    <img width="200" src="https://raw.githubusercontent.com/elos-lang/elos/main/logo.png">
  </a>
</p>

# ELOS Language
## Build HTML emails, but without the torture

Crafting HTML emails has always been a pain—inline styles, inconsistent 
rendering across email clients, and a sea of outdated quirks to navigate. 
Elos changes that.

ELOS is a declarative, developer-friendly language designed specifically for 
building responsive, accessible, and beautifully branded HTML emails. Forget about 
manually wrestling with tables and obscure CSS hacks—ELOS abstracts the complexities, 
letting you focus on design and content while ensuring rock-solid email compatibility.

### With ELOS, you get:
✅ Simplified Syntax – Write structured, readable code that compiles into bulletproof HTML.<br />
✅ Smart Defaults – No more worrying about missing styles or broken layouts.<br />
✅ Reusable Components – Build once, reuse everywhere.<br />
✅ Responsive by Default – Emails that look great on any device, without extra hassle.<br />

Say goodbye to email development frustration and hello to ELOS.<br />
Let’s make HTML emails enjoyable again. 🚀

## Roadmap
- Correct the location of files in includes
- Primitives: Variables (assignment, printing), String, Number, Colors
- Improved (cleanup) styling system
- 100% test coverage
- cli
- Conditionals
- Raw / Print node

## Getting started

## Language design example
```
def width 750
def hgap 25
def vgap 25

style group {
    padding 25
}

style btn {
    size 14
    bgcolor "#f14000"
}

style txt {
    size 14
    color "#333333"
}

style .footer {
    bgcolor "#cccccc"
}

style .cta {
    padding 50
    bgcolor "#f10000"
}

style .h {
    color "red"
    size 18
    transform "uppercase"
}

style .hh {
    color "blue"
    size 16
}

body {
    space
    img "https://dummyimage.com/600x200/000/fff" -> "https://www.google.be"
    group {
        txt.h "Hallo Maïté!"
        space
        cols
            col {
                img "https://dummyimage.com/600x400/000/fff"
            }
            col {
                img "https://dummyimage.com/600x400/000/fff"
            }
            col {
                img "https://dummyimage.com/600x400/000/fff"
            }
    }
    group.cta {
        btn "Ontdek ons aanbod" -> "https://www.reinvanoyen.be"
    }
    group {
        cols
            col {
                txt "Hallo dit is leuk"
                img "https://dummyimage.com/600x400/000/fff"
            }
            col {
                txt "Hallo dit is leuk"
                img "https://dummyimage.com/600x400/000/fff"
            }
    }
    line
    group.footer {
        cols
            col {
                txt.hh "Hallo dit is leuk"
                img "https://dummyimage.com/600x400/000/fff"
            }
            col {
                txt.hh "Hallo dit is leuk"
                img "https://dummyimage.com/600x400/000/fff"
            }
    }
    space
}
```

### Credits
<a href="https://www.flaticon.com/free-icons/pet" title="pet icons">Pet icons created by Freepik - Flaticon</a>
