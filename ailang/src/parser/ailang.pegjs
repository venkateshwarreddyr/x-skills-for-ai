Program
  = items:(Import / Goal / Entity / Action / Invariant / Workflow / Derived)* { return items; }

Import
  = "import" _ path:String _ {
      return { type: "import", path };
    }

Goal
  = "goal" _ text:Expression _ {
      return { type: "goal", text };
    }

Derived
  = "derived" _ name:Identifier _ "{" _ body:When* _ "}" _ {
      return { type: "derived", name, body };
    }

When
  = "when" _ condition:Expression _ {
      return { type: "when", condition };
    }

Entity
  = "entity" _ name:Identifier _ "{" _ fields:Field* _ "}" _ {
      return { type: "entity", name, fields };
    }

Field
  = name:Identifier _ ":" _ type:Type _ {
      return { name, type };
    }

Type
  = [a-zA-Z_][a-zA-Z0-9_ |]* { return text(); }

Action
  = "action" _ name:Identifier _ "{" _ body:(Requires / Effects / Emit)* _ "}" _ {
      const requires = body.filter(b => b.type === "requires").map(b => b.condition);
      const effects = body.filter(b => b.type === "effects").map(b => b.effect);
      const emits = body.filter(b => b.type === "emit").map(b => b.event);
      return { type: "action", name, requires, effects, emits };
    }

Invariant
  = "invariant" _ condition:Expression _ {
      return { type: "invariant", condition };
    }



Requires
  = "requires" _ condition:Expression _ {
      return { type: "requires", condition };
    }

Effects
  = "effects" _ effect:Expression _ {
      return { type: "effects", effect };
    }

Emit
  = "emit" _ name:Identifier _ "(" _ args:Args _ ")" _ {
      return { type: "emit", event: { name, args } };
    }

Args
  = args:Identifier* { return args; }

Workflow
  = "workflow" _ name:Identifier _ "{" _ transitions:Transition* _ "}" _ {
      return { type: "workflow", name, transitions };
    }

Transition
  = from:Identifier _ "->" _ action:Identifier _ toPart:("->" _ to:Identifier _)? {
      return { from, action, to: toPart ? toPart[2] : null };
    }

Expression
  = [^\n\r]* { return text().trim(); }  // Simplified, just capture the line

String
  = "\"" [^\"]* "\"" { return text().slice(1, -1); }

Identifier
  = [a-zA-Z_][a-zA-Z0-9_.]* { return text(); }

_
  = [ \t\n\r]*