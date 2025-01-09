---
title: "Unity Modular Inputs with ScriptableObjects"
date: 2025-01-08T14:18:28-05:00
draft: false
cover:
    image: ""
tags: ["unity"]
mermaid: true
---

Managing inputs in Unity can quickly become unwieldy, especially when dealing with multiple devices and input schemes. This guide explores a modular approach using **ScriptableObjects** to manage device-specific icons, decouple input events, and enable dependency injection for flexibility.

## Goals

- **Ease of Management**: Simplify handling device-specific input icons.
- **Decoupling**: Avoid relying on a centralized input manager.
- **Flexibility**: Use ScriptableObjects for modular and reusable input definitions.

## Drawbacks

- `InputActionDefinition` `OnInput` returns a `CallbackContext` that can have any information
- Subscribers have to assume the `CallbackContext` has the info they need (ex. a `Vector2`)

## Steps

Follow these steps to implement this architecture:

1. **Setup Input Actions**: Open a Unity `InputAction` asset and configure the necessary inputs.
2. **Create InputActionDefinitions**: For each input, create an `InputActionDefinition` ScriptableObject.
3. **Add a PlayerInput Component**: Attach a `PlayerInput` component to a GameObject in the scene.
4. **Set to Invoke Unity Events**: Configure the `PlayerInput` component's behavior to **Invoke Unity Events**.
5. **Bind Input Definitions**: Assign an `InputActionDefinition` to trigger the `Fire()` method for each input action.
6. **Inject Inputs Where Needed**: In future components, reference the appropriate `InputActionDefinition` assets to handle inputs.

## Architecture Diagram

Below is a high-level architecture diagram of this setup:

{{< mermaid >}}
classDiagram
    class ScriptableObject
    
    class InputActionDefinition {
        +name : string
        +keyboardIcon : Sprite
        +gamepadIcon : Sprite
        +touchIcon : Sprite

        +OnInput : Action~InputAction.CallbackContext~

        +Fire() void
        +GetIcon() Sprite
    }

    ScriptableObject <|-- InputActionDefinition
    InputActionDefinition -- Move.asset : Create SO
    InputActionDefinition -- Jump.asset : Create SO
    Move.asset <.. PlayerController : References
    Jump.asset <.. PlayerController : References

    class PlayerController {
        +InputActionDefinition OnMove;
        +InputActionDefinition OnJump;

        +Move() void
        +Jump() void
    }

    class PlayerInput {


    }
    note for PlayerController "Pass in the desired definition assets.<br>Use their OnInput event."
    note for PlayerInput "Set behavior to invoke Unity Event.<br>Match the InputActions with<br>the related InputActionDefinition"
{{< /mermaid >}}

### Example PlayerInput Component

{{< img src="player-input.png" >}}

## Example Implementation

Here’s a simple example of how input handling might look in your script:

```csharp
//PlayerController.cs

[SerializeField] InputActionDefinition OnMove;
[SerializeField] InputActionDefinition OnJump;

private void Start()
{
    OnMove.OnInput += HandleMove;
    OnJump.OnInput += HandleJump;
}

private void HandleMove(InputAction.CallbackContext ctx) {
    Vector2 movement = ctx.ReadValue<Vector2>();
    // Movement Logic
}

private void HandleJump(InputAction.CallbackContext ctx) {
    if (ctx.started) {
        // Jump Logic
    }
}
```