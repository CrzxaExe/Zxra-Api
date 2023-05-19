export { Tags, blockWarning, rules, text, clearItemEntity, menu, option }
// CrzxaExe3

// [ID] Ranks tag dan juga warna ranknya, warna bisa dilihat di paling bawah file "main.js"
// [EN] Rank tag and the rank color, color can be found on bottom of the file "main.js"
var Tags = {
	"Admin": "green",
	"Zxra": "§b§l",
	"Owner": "bold_purple",
	"PVP": "dark_red",
	"Youtube": "§c"
}

// [ID] Pengaturan dari text in game
// [EM] Settings of the text in game
let text = {
	"cmdErr": "Please type +help to see command that works",
	"rankWrong": "There is no rank on you",
	"rank": "Rank subcommand\n> check\n> list",
	"homeTeleport": "Teleporting in 3 seconds...",
	"homeSuccess": "Success teleporting to home",
	"notAdmin": "You are not admin",
	"noMoney": "Cannot buy %item, the price $%price",
	"buy": "You buy %item $%price",
	"noItem": "There is no item in shop",
	"clearItem": "<Server> Entity item will be clear on %time second again",
	"clearItemSuccess": "<Server> Successfuly clear entity item",
	"sunset": "The days become darker, the monsters are arise",
	"sunrise": "The sun are rise, lets working",
	"playerJoin": "[§2+§r] %user",
	"weatherRain": "Raining days",
	"weatherThunder": "Watch out the lightning",
	"levelUp": "Your %skill has level up"
}
// [ID] Pengaturan beberapa fitur, ubah ke false untuk mematikan fitur
// [EN] Settings some features, change to falss for disable the features
let option = {
	"itemBookRulesName": "Rules",
	"respawnAnchor": true,
	"respawnAnchorDimension": [
	  "minecraft:the_end",
	  "minecraft:overworld"
    ],
	"sneakDisplay": true
}

let clearItemEntity = {
	// [ID] Ini adalah clear item entity
    // >>>> Lu bisa matiin fitur ini dengan mengubah dari true ke false
	// [EN] This is clear item entity
	// >>>> You can disable this feature by changing true to false
	"enable": true,
	// [ID] Berapa lama jeda antar clearnya, 20 tick = 1 detik irl
    // [EN] How long is the delay between clears, 20 ticks = 1 second irl
	"ticks": 3600,
	// [ID] Berapa lama delay dari mulainya fitur ini untuk menghapus item entity
	// [EN] How long the delay of clearing the entity item
	"delay": 600
}

// [ID] Menu gui
// [EN] Menu gui
let menu = {
	"title": "Zxra Menu UI",
	"description": "Please select the menu below",
	"button": [
	  {
		"textures": "textures/ui/icon_steve.png",
		"name": "Profile",
		"description": "Your Stats:\n$%money\nRanks: %rank\n \nSkills level:\nSlayer lvl %slayer (%slayXp/%slayMax Xp)"
	  },
	  {
		"textures": "textures/ui/dev_glyph_color",
		"name": "API Settings",
		"description": "Clear Item Entity:\n%enable,"
	  }
	]
}

// [ID] UI dari respawn anchor disable
// [EN] UI from respawn anchor disable
let blockWarning = {
	"title": "Block has been banned in this dimension",
	"body": "You can't use this block in here",
	"button1": "Ok",
	"button2": "Ok"
}

// [ID] UI dari rules
// [EN] UI from rules
let rules = {
	"title": "Rules",
	"body": "You must follow this rule if you don't wanna got banned\n1. No cheating\n2. No Toolbox\n3. No grief\n4. No glitching",
	"button1": "Yes sir",
	"button2": "Okeh"
}