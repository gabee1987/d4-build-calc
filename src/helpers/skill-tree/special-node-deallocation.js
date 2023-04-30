export const deallocateSpecialChildrenPoints = (
  node,
  allNodes,
  treeContainerRef,
  onPointDeallocated,
  updatePointIndicator
) => {
  if (!node.children) return;

  for (const child of node.children) {
    const childNode = allNodes.find((n) => n.name === child.name);
    if (childNode) {
      console.log("childNode -> ", childNode);

      onPointDeallocated(childNode);
      childNode.allocatedPoints = 0;

      updatePointIndicator(
        childNode.name,
        childNode.allocatedPoints,
        childNode.maxPoints,
        childNode.nodeType,
        treeContainerRef
      );

      deallocateSpecialChildrenPoints(childNode, allNodes);
    }
  }
};

export const canDeallocateClassSpecificNode = (node, nodes, selectedClass) => {
  switch (selectedClass) {
    case "Barbarian":
      return deallocateBarbarianNode(node, nodes);
    case "Necromancer":
      return deallocateNecromancerNode(node, nodes);
    case "Sorcerer":
      return deallocateSorcererNode(node, nodes);
    case "Rogue":
      return deallocateRogueNode(node, nodes);
    case "Druid":
      return deallocateDruidNode(node, nodes);
    default:
      console.error(
        "Unknown class name at special node deallocation:",
        selectedClass
      );
      return;
  }
};

const findNodeByName = (name, nodes) => {
  return nodes.find((n) => n.name === name);
};

// ====================== BARBARIAN
const deallocateBarbarianNode = (node, nodes) => {
  // Weapon Mastery group #1
  const PitFighter = findNodeByName("Pit Fighter", nodes);
  const SlayingStrike = findNodeByName("Slaying Strike", nodes);
  const ExposeVulnerability = findNodeByName("Expose Vulnerability", nodes);
  const NoMercy = findNodeByName("No Mercy", nodes);

  if (node.allocatedPoints - 1 > 0) {
    return true;
  }

  if (node.name === PitFighter.name) {
    // PitFighter
    if (
      SlayingStrike.allocatedPoints > 0 ||
      ExposeVulnerability.allocatedPoints > 0 ||
      NoMercy.allocatedPoints > 0
    ) {
      return false;
    }
  }
  // SlayingStrike
  else if (node.name === SlayingStrike.name) {
    if (
      ExposeVulnerability.allocatedPoints > 0 &&
      NoMercy.allocatedPoints === 0
    ) {
      return false;
    }
  }
  // ExposeVulnerability -> can be deAllocateable any time
  // NoMercy
  else if (node.name === NoMercy.name) {
    if (
      ExposeVulnerability.allocatedPoints > 0 &&
      SlayingStrike.allocatedPoints === 0
    ) {
      return false;
    }
  }

  // Ultimate group #1
  const Wallop = findNodeByName("Wallop", nodes);
  const BruteForce = findNodeByName("Brute Force", nodes);
  const HeavyHanded = findNodeByName("Heavy Handed", nodes);
  const Concussion = findNodeByName("Concussion", nodes);

  if (node.name === Wallop.name) {
    // Wallop
    if (
      Concussion.allocatedPoints > 0 ||
      (BruteForce.allocatedPoints > 0 && HeavyHanded.allocatedPoints === 0)
    ) {
      return false;
    }
  }
  // BruteForce -> can be deAllocateable any time
  // HeavyHanded
  else if (node.name === HeavyHanded.name) {
    if (BruteForce.allocatedPoints > 0 && Wallop.allocatedPoints === 0) {
      return false;
    }
  }
  // Concussion -> can be deAllocateable any time

  return true;
};

// ====================== NECROMANCER
const deallocateNecromancerNode = (node, nodes) => {
  // Summoning group #1
  const GrueSomeMending = findNodeByName("Gruesome Mending", nodes);
  const Transfusion = findNodeByName("Transfusion", nodes);
  const TidesOfBlood = findNodeByName("Tides of Blood", nodes);
  const CoalescedBlood = findNodeByName("Coalesced Blood", nodes);
  const DrainVitality = findNodeByName("Drain Vitality", nodes);

  if (node.allocatedPoints - 1 > 0) {
    return true;
  }

  // GrueSomeMending
  if (node.name === GrueSomeMending.name) {
    if (Transfusion.allocatedPoints > 0 || CoalescedBlood.allocatedPoints > 0) {
      return false;
    }
  }
  // Transfusion
  else if (node.name === Transfusion.name) {
    if (
      TidesOfBlood.allocatedPoints > 0 &&
      CoalescedBlood.allocatedPoints === 0
    ) {
      return false;
    }
  }
  // TidesOfBlood -> can be deAllocateable any time

  // CoalescedBlood
  else if (node.name === CoalescedBlood.name) {
    if (
      DrainVitality.allocatedPoints > 0 ||
      (TidesOfBlood.allocatedPoints > 0 && Transfusion.allocatedPoints === 0)
    ) {
      return false;
    }
  }
  // DrainVitality -> can be deAllocateable any time
  // Summoning group #2
  const ReapersPursuit = findNodeByName("Reaper's Pursuit", nodes);
  const Gloom = findNodeByName("Gloom", nodes);
  const Terror = findNodeByName("Terror", nodes);
  const CripplingDarkness = findNodeByName("Crippling Darkness", nodes);

  // ReapersPursuit
  if (node.name === ReapersPursuit.name) {
    if (Gloom.allocatedPoints > 0 || CripplingDarkness.allocatedPoints > 0) {
      return false;
    }
  }
  // Gloom
  else if (node.name === Gloom.name) {
    if (Terror.allocatedPoints > 0 && CripplingDarkness.allocatedPoints === 0) {
      return false;
    }
  }
  // Terror -> can be deAllocateable any time
  // CripplingDarkness
  else if (node.name === CripplingDarkness.name) {
    if (Terror.allocatedPoints > 0 && Gloom.allocatedPoints === 0) {
      return false;
    }
  }

  // Summoning group #3
  const Serration = findNodeByName("Serration", nodes);
  const RapidOssification = findNodeByName("Rapid Ossification", nodes);
  const Evulsion = findNodeByName("Evulsion", nodes);
  const CompoundFracture = findNodeByName("Compound Fracture", nodes);

  // Serration
  if (node.name === Serration.name) {
    if (
      RapidOssification.allocatedPoints > 0 ||
      CompoundFracture.allocatedPoints > 0
    ) {
      return false;
    }
  }
  // RapidOssification
  else if (node.name === RapidOssification.name) {
    if (
      Evulsion.allocatedPoints > 0 &&
      CompoundFracture.allocatedPoints === 0
    ) {
      return false;
    }
  }
  // Evulsion -> can be deAllocateable any time
  // CompoundFracture
  else if (node.name === CompoundFracture.name) {
    if (
      Evulsion.allocatedPoints > 0 &&
      RapidOssification.allocatedPoints === 0
    ) {
      return false;
    }
  }

  return true;
};

// ====================== SORCERER
const deallocateSorcererNode = (node, nodes) => {
  // Ultimate group #1
  const Permafrost = findNodeByName("Permafrost", nodes);
  const Hoarfrost = findNodeByName("Hoarfrost", nodes);
  const FrigidBreeze = findNodeByName("Frigid Breeze", nodes);
  const IcyTouch = findNodeByName("Icy Touch", nodes);

  if (node.allocatedPoints - 1 > 0) {
    return true;
  }

  // Permafrost
  if (node.name === Permafrost.name) {
    if (Hoarfrost.allocatedPoints > 0 || IcyTouch.allocatedPoints > 0) {
      return false;
    }
  }
  // Hoarfrost
  else if (node.name === Hoarfrost.name) {
    if (FrigidBreeze.allocatedPoints > 0 && IcyTouch.allocatedPoints === 0) {
      return false;
    }
  }
  // FrigidBreeze -> can be deAllocateable any time
  // IcyTouch
  else if (node.name === IcyTouch.name) {
    if (FrigidBreeze.allocatedPoints > 0 && Hoarfrost.allocatedPoints === 0) {
      return false;
    }
  }

  // Ultimate group #2
  const FierySurge = findNodeByName("Fiery Surge", nodes);
  const EndlessPyre = findNodeByName("Endless Pyre", nodes);
  const Warmth = findNodeByName("Warmth", nodes);
  const Soulfire = findNodeByName("Soulfire", nodes);

  // FierySurge
  if (node.name === FierySurge.name) {
    if (EndlessPyre.allocatedPoints > 0 || Soulfire.allocatedPoints > 0) {
      return false;
    }
  }
  // EndlessPyre
  else if (node.name === EndlessPyre.name) {
    if (Warmth.allocatedPoints > 0 && Soulfire.allocatedPoints === 0) {
      return false;
    }
  }
  // Warmth -> can be deAllocateable any time
  // Soulfire
  else if (node.name === Soulfire.name) {
    if (Warmth.allocatedPoints > 0 && EndlessPyre.allocatedPoints === 0) {
      return false;
    }
  }

  // Ultimate group #3
  const CoursingCurrents = findNodeByName("Coursing Currents", nodes);
  const Electrocution = findNodeByName("Electrocution", nodes);
  const Convulsions = findNodeByName("Convulsions", nodes);
  const Conduction = findNodeByName("Conduction", nodes);

  // CoursingCurrents
  if (node.name === CoursingCurrents.name) {
    if (Electrocution.allocatedPoints > 0 || Conduction.allocatedPoints > 0) {
      return false;
    }
  }
  // Electrocution
  else if (node.name === EndlessPyre.name) {
    if (Convulsions.allocatedPoints > 0 && Conduction.allocatedPoints === 0) {
      return false;
    }
  }
  // Convulsions -> can be deAllocateable any time
  // Conduction
  else if (node.name === Conduction.name) {
    if (
      Convulsions.allocatedPoints > 0 &&
      Electrocution.allocatedPoints === 0
    ) {
      return false;
    }
  }

  return true;
};

// ====================== ROGUE
const deallocateRogueNode = (node, nodes) => {
  // Agility group #1
  const Concussive = findNodeByName("Concussive", nodes);
  const TrickAttacks = findNodeByName("Trick Attacks", nodes);
  const RapidGambits = findNodeByName("Rapid Gambits", nodes);

  if (node.allocatedPoints - 1 > 0) {
    return true;
  }

  // Concussive
  if (node.name === Concussive.name) {
    if (
      TrickAttacks.allocatedPoints > 0 &&
      RapidGambits.allocatedPoints === 0
    ) {
      return false;
    }
  }
  // TrickAttacks -> can be deAllocateable any time
  // RapidGambits
  else if (node.name === RapidGambits.name) {
    if (TrickAttacks.allocatedPoints > 0 && Concussive.allocatedPoints === 0) {
      return false;
    }
  }

  // Ultimate group #1
  const Innervation = findNodeByName("Innervation", nodes);
  const AlchemistsFortune = findNodeByName("Alchemist's Fortune", nodes);
  const SecondWind = findNodeByName("Second Wind", nodes);

  // Innervation
  if (node.name === Innervation.name) {
    if (
      AlchemistsFortune.allocatedPoints > 0 ||
      SecondWind.allocatedPoints > 0
    ) {
      return false;
    }
  }

  // Ultimate group #2
  const AdrenalineRush = findNodeByName("Adrenaline Rush", nodes);
  const Impetus = findNodeByName("Impetus", nodes);
  const Haste = findNodeByName("Haste", nodes);

  // AdrenalineRush
  if (node.name === AdrenalineRush.name) {
    if (Impetus.allocatedPoints > 0 || Haste.allocatedPoints > 0) {
      return false;
    }
  }

  return true;
};

// ====================== DRUID
const deallocateDruidNode = (node, nodes) => {
  // Wrath group #1
  const ElementalExposure = findNodeByName("Elemental Exposure", nodes);
  const ChargedAtmosphere = findNodeByName("Charged Atmosphere", nodes);
  const ElectricShock = findNodeByName("Electric Shock", nodes);
  const BadOmen = findNodeByName("Bad Omen", nodes);
  const EndlessTempest = findNodeByName("Endless Tempest", nodes);

  if (node.allocatedPoints - 1 > 0) {
    return true;
  }

  // ElementalExposure
  if (node.name === ElementalExposure.name) {
    if (
      ChargedAtmosphere.allocatedPoints > 0 ||
      EndlessTempest.allocatedPoints > 0
    ) {
      return false;
    }
  }
  // ChargedAtmosphere
  else if (node.name === ChargedAtmosphere.name) {
    if (
      (ElectricShock.allocatedPoints > 0 && BadOmen.allocatedPoints === 0) ||
      (BadOmen.allocatedPoints > 0 && EndlessTempest.allocatedPoints === 0)
    ) {
      return false;
    }
  }
  // ElectricShock
  else if (node.name === ElectricShock.name) {
    if (
      ChargedAtmosphere.allocatedPoints > 0 &&
      BadOmen.allocatedPoints === 0
    ) {
      return false;
    }
  }
  // BadOmen
  else if (node.name === BadOmen.name) {
    if (
      EndlessTempest.allocatedPoints > 0 &&
      ElectricShock.allocatedPoints > 0 &&
      ChargedAtmosphere.allocatedPoints === 0
    ) {
      return false;
    }
  }
  // EndlessTempest
  else if (node.name === EndlessTempest.name) {
    if (
      BadOmen.allocatedPoints > 0 &&
      ChargedAtmosphere.allocatedPoints === 0
    ) {
      return false;
    }
  }

  // Ultimate group #1
  const Defiance = findNodeByName("Defiance", nodes);
  const CircleOfLife = findNodeByName("Circle of Life", nodes);
  const Resonance = findNodeByName("Resonance", nodes);
  const NaturalDisaster = findNodeByName("Natural Disaster", nodes);

  // Defiance
  if (node.name === Defiance.name) {
    if (
      CircleOfLife.allocatedPoints > 0 ||
      NaturalDisaster.allocatedPoints > 0
    ) {
      return false;
    }
  }
  // CircleOfLife
  else if (node.name === CircleOfLife.name) {
    if (
      Resonance.allocatedPoints > 0 &&
      NaturalDisaster.allocatedPoints === 0
    ) {
      return false;
    }
  }
  // Resonance -> can be deAllocateable any time
  // NaturalDisaster
  else if (node.name === NaturalDisaster.name) {
    if (Resonance.allocatedPoints > 0 && CircleOfLife.allocatedPoints === 0) {
      return false;
    }
  }

  // Ultimate group #1
  const DefensivePosture = findNodeByName("Defensive Posture", nodes);
  const ThickHide = findNodeByName("Thick Hide", nodes);
  const Unrestrained = findNodeByName("Unrestrained", nodes);
  const NaturesResolve = findNodeByName("Nature's Resolve", nodes);

  // DefensivePosture
  if (node.name === DefensivePosture.name) {
    if (ThickHide.allocatedPoints > 0 || NaturesResolve.allocatedPoints > 0) {
      return false;
    }
  }
  // ThickHide
  else if (node.name === ThickHide.name) {
    if (
      Unrestrained.allocatedPoints > 0 &&
      NaturesResolve.allocatedPoints === 0
    ) {
      return false;
    }
  }
  // Unrestrained -> can be deAllocateable any time
  // NaturesResolve
  else if (node.name === NaturesResolve.name) {
    if (Unrestrained.allocatedPoints > 0 && ThickHide.allocatedPoints === 0) {
      return false;
    }
  }

  return true;
};
