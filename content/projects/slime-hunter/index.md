---
title: "Slime Hunter: Action-RPG"
date: 2024-07-12T21:36:00-04:00
draft: false
cover:
    image: "https://img.itch.zone/aW1nLzE3NTExMTE2LnBuZw==/original/MIHxmP.png"
tags: ["gamedev", "unity", "csharp"]
badges:
    - icon: "unity"
    - icon: "csharp"
    - icon: "fmod"
socialIcons:
    - name: "itchio"
      url: "https://studiobounce.itch.io/slime-hunter-studio-bounce"
    - name: "github"
      url: "https://github.com/Studio-Bounce/slime-hunter"

---

{{< youtube kVwYAnipyD8 >}}

> Trailer created with **Blender** by me

## Slime Hunter

**Slime Hunter** is a *3D Top-Down Action RPG* set in the fantasy world of **Slimeria**, where players hunt cute and dangerous slimes. Featuring comprehensive combat, spell, and inventory systems, diverse enemies, and a beautifully hand-built environment.

> Slimeria is a fantasy world where Slimes are the primary fauna alongside humans. For mysterious reasons, the slime population has grown significantly while more dangerous breeds wreaking havoc on local towns. You play a lone slime hunter, making their journey through Slimeria to learn about the state of the slime invasion and hopefully find the source.

### How It Began

As part of Sheridan's 12-month GDAP (Advanced Game Programming) program, the final four months were dedicated to developing a game. During the first semester, we pitched our game ideas, voted on the most captivating concepts, and formed teams based on those votes. **My game was selected** for development, inspired by the flash game from my childhood, [Amorphous+](https://kongregate.fandom.com/wiki/Amorphous%2B).

Our team consisted of **two programmers** and **two designers**, with me as one of the programmers. In the second semester, we focused on planning and designing the game between classes. The final semester was dedicated to bringing the game to life over the course of four months.

---

## What I Worked On

As a small team with two programmers, both of us contributed to most game systems. However, I was primarily responsible for designing and implementing several key features.

{{< tiles >}}
    {{< card src="combat.webp" >}}
        Melee Combat and Arenas
    {{</ card >}}
    {{< card src="spell.webp" >}}
        Spell Casting System
    {{</ card >}}
{{</ tiles >}}

{{< card src="ui.webp" >}}
    Full Responsive UI Implementation
{{</ card >}}

{{< tiles >}}
    {{< card src="camera.webp" >}}
        Camera Transitions & Effects
    {{</ card >}}
    {{< card src="particles.webp" >}}
        Particles & Post-Processing
    {{</ card >}}
{{</ tiles >}}

{{< card src="inventory.webp" >}}
    Inventory System
{{</ card >}}

### Also...

- Full FMOD Audio Integration Including Dynamic Music & SFX
- Controller Support with Adaptive Button Prompts
- Multi-Scene Load Structure

## Other Features

- Dialogue System Using [Ink](https://www.inklestudios.com/ink/)
- Quest System
- Bitstream Saving/Loading
- Steering Behavior & FSM Enemy AI
- Custom Built Environments and Assets

## Game System Highlights

### Combat System

The challenge with the combat system is that we wanted to support multiple weapons with different combo animations and be able to swap between them on the fly. To achieve this, I created a `ScriptableObject` that holds the weapon stats and combo information.

```csharp
[Serializable]
public class AttackMove
{
    [Header("Animation Properties")]
    public AnimationClip clip;
    public float animationDelay; // When the attack starts in the animation
    public float animationDuration = 0.5f; // How long the attacks lasts
    public bool flip;
    public float rotation;

    [Header("Attack Attributes")]
    public float attackDuration = 0.3f; // How long to combo into next attack
    public float comboDuration; // How long to combo into next attack
    public float damageMultiplier = 1.0f;
    public float rangeMultiplier = 1.0f;
    public float knockbackMultiplier = 1.0f;

    [Header("Material Properties")]
    public float rotateSpeed;
    [Range(0, 360)] public float angleRange;
    [Range(0, 360)] public float angleStart;
    public float rotationGamma;
    [Range(0, 1)] public float voranoiPeak;

    [Header("Attack Audio")]
    public FMODUnity.EventReference audioHitEvent;
}

[CreateAssetMenu(menuName = "Weapon")]
public class WeaponSO : ItemSO
{
    [Header("Weapon Attributes")]
    public Damage damage;
    public float range;
    public LayerMask hitLayers;

    [Header("Weapon References")]
    public GameObject weaponModel;
    public Material material;
    public List<AttackMove> attackMoves;
}
```

I go further into how the comboing and attack hitboxing works in my [previous post]({{< ref "/posts/2024/06/responsive-melee-combat" >}}). In summary, I track each of the attack with an enum

```csharp
public enum AttackState
    {
        WIND_UP,
        ACTIVE,
        WIND_DOWN, // This state should be interruptable
        INACTIVE
    }
```

I then handle the hitbox state and combo interruptions/increments based on the current state. For playing the correct animations, I use an `AnimatorOverrideController` to replace the current playing animation with the one in the next attack. This allows me the script the attack transitions rather than needing to manually assign attack animations to an `Animator`.

One issue this brought up was because I'm changing the animation on a single state, I don't get a smooth transition between attack animations; instead it just snaps directly to the next pose. One solution would be to have two states attack states and transition back and forth between them for as long as the combo requires.

In the end this wasn't implemented due to time constraints that resulted in us having only 1 set of animations anyways. We just added 3 states directly into the animator to transition with. In the future, we'd like to add back combo flexibility.

### Spells and Casting Indicators

For spells, I wanted create a reusable system that made it easy to create new spells and adjust their stats through exposed properties. I also wanted to make the spell indicators reusable as a lot of spells will have the same method of casting. For instance, a fireball and a stun bomb would have likely use the same radial indicators for casting. 

### Damage and Status Effects

I manage with a simple struct that contains all the information for any instance of damage that occurs.

```csharp
public struct Damage
{
    public float value;
    public float knockback;
    [HideInInspector] public Vector3 direction;
    public StatusEffect effect;
    public bool forceApply;
}
```

For status effects, because of the variable nature of status effects, I employed a number of design patterns to ensure modularity and extensibility.

- Template Method Pattern
  - Each status effect has a set of abstract methods to implement how a status should effect its host
- Factory Method
  - A class manages the list of active effects and has exposes methods for creating new status effect instances

```csharp
// StatusEffects.cs
protected abstract void OnStartEffect(DynamicDamageTaker taker);
protected abstract void OnUpdateEffect(DynamicDamageTaker taker);
protected abstract void OnEndEffect(DynamicDamageTaker taker);
```

```csharp
// StatusEffectManager.cs
public void AddEffect(StatusEffect newEffect)
{
    StatusEffect effectInstance = Instantiate(newEffect);
    effectInstance.Initialize();
    effectInstance.StartEffect(damageTaker);
    activeEffects.Add(effectInstance);

    statusBar.AddStatusEffect(effectInstance);
}
```

### Inventory System

One thing I realized early on was that the inventory and items interacted with a lot of UI from all over the place. For instance, there was inventory UI itself that needed to be updated but there was also shops the displayed your resource counts and HUD elements for pickups.

I knew I needed to keep the UI logic encapsulated from the Inventory System but be able to be notified whenever there's an inventory change.

- Unity Events | Observer Pattern

```csharp
public event Action OnInventoryChanged = delegate { };
public event Action<WeaponSO[]> OnEquippedWeaponsChanged = delegate { };
public event Action<SpellSO[]> OnEquippedSpellsChanged = delegate { };
public event Action<ItemSO> OnItemAdded = delegate { };
```

Through these events, any other object can subscribe to inventory changes and keep itself updated but still function on it's own.

#### Serialization

Another challenge was figuring how I was going to write the load information form the inventory. We already a save and load system for writing/reading bits to a file but I still needed to decide what I was writing.

- Saving and Loading Addressables Async

I have an `ItemSO` which holds all the stats, icons, prefab, etc. information for any item. These properties are constant for a given item and won't ever change. What will change is the quantity of that item. I opted to create a new class that holds a reference to an `ItemSO`. There I can just serialize the quantity and an asset reference to the `ScriptableObject`

```csharp
public class Item
{
    public ItemSO itemRef;
    public int quantity = 1;

    public IEnumerator ReadAsync(BinaryReader br)
    {
        string address = br.ReadString();
        var handle = Addressables.LoadAssetAsync<ItemSO>(address);
        yield return handle;
        itemRef = handle.Result;
        quantity = br.ReadInt32();
    }

    public void Write(BinaryWriter bw)
    {
        if (itemRef != null)
            bw.Write(itemRef.address);
        bw.Write(quantity);
    }
}