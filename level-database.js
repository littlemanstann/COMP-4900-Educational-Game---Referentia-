
export const levels = [
    //ice slime
    {
        monsterSprite: "src/monsters/ice_slime.png",
        solution: ["fireball"],
        background: "src/backgrounds/ice_plains.png",
        hint: null,
        music: "src/music/New Norm.mp3"
    },


    //skeleton
    {
        monsterSprite: "src/monsters/skeleton.png",
        solution: ["divine beam", "azimuth blight"],
        background: "src/backgrounds/bonewood_forest.png",
        hint: null,
        music: "src/music/The_Whispering_Woods.mp3"
    },

    //double level
    {
        monsterSprite: "src/monsters/shadow_slime.png",
        solution: ["divine beam", "azimuth blight"],
        background: "src/backgrounds/grave_graveyards.png",
        hint: "Hint: To reveal this monster's true nature, a flicker of brilliance is necessary",
        music: "src/music/idk.flac"
    },
    {
        monsterSprite: "src/monsters/fire_slime.png",
        solution: ["water cannon"],
        background: "src/backgrounds/grave_graveyards.png",
        hint: null,
        music: "src/music/idk.flac"
    },
    //

    //pit ghast
    {
        monsterSprite: "src/monsters/pit_ghast.png",
        solution: ["ice shard"],
        background: "src/backgrounds/volcano.png",
        hint: "Hint: This monster is very similar to one which appears in The Cemetery",
        music: "src/music/The_Whispering_Woods.mp3"
    },

    //squid
    {
        monsterSprite: "src/monsters/noughtsquid.png",
        solution: ["forked fury"],
        background: "src/backgrounds/ocean.png",
        hint: "Hint: A monster's scale is the key context here",
        music: "src/music/mountain boss themee.flac"
    },
    
    //criptid
    {
        monsterSprite: "src/monsters/flies.png",
        solution: ["boulder roll"],
        background: "src/backgrounds/criptid.png",
        hint: "Hint: The Maniacal Magicians have encountered this monster once before",
        music: "src/music/village theme dark.flac"
    },
    
    //miniboss
    {
        monsterSprite: null,
        solution: ["fiery shackles of imprisonment"],
        background: "src/backgrounds/miniboss.png",
        hint: "Hint: Start with finding out where this monster is",
        music: "src/music/Untitled score.mp3"
    },
    
    //Triptych
    {
        monsterSprite: "src/monsters/triptych.png",
        solution: ["azimuth blight"],
        background: "src/backgrounds/grave_graveyards.png",
        hint: "Hint: This monster was defeated one year after the infamous spell was discovered",
        music: "src/music/combat.flac"
    },

    //bone golem
    {
        monsterSprite: "src/monsters/bone_golem.png",
        solution: ["as above, so below"],
        background: "src/backgrounds/bonewood_forest.png",
        hint: "Hint: The Genus of this monster holds a key ingredient in defeating it",
        music: "src/music/golem_theme.flac"
    }
];

// levels = {"./images/monsters/ice_slime.png", }