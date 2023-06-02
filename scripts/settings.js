export { Tags, blockWarning, text, menu }
// CrzxaExe3

// [ID] Ranks tag dan juga warna ranknya, warna bisa dilihat di file "function.js"
// [EN] Rank tag and the color, color can be found on the file "function.js"
var Tags = {
	"Admin": "green",
	"Zxra": "§b§l",
	"Owner": "bold_purple",
	"PVP": "dark_red",
	"Youtube": "§c",
	"Legend": "purple",
	"Mvp": "yellow",
	"Mythic": "bold_light_purple",
	"VIP": "light_purple"
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
	"noMoney": "You not have money to buy %item, the price $%price",
	"buy": "You buy %item $%price",
	"noItem": "There is no item in shop",
	"clearItem": "<Server> Entity item will be clear on %time second again",
	"clearItemSuccess": "<Server> Successfuly clear entity item",
	"sunset": "The days become darker, the monsters are arise",
	"sunrise": "The sun are rise, lets working",
	"weatherRain": "Raining days",
	"weatherThunder": "Watch out the lightning",
	"levelUp": "Your %skill has level up"
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
		"displayName": "%s's Profile",
		"description": "Stats:\n$%money\nRanks: %rank\n \nSkills level:\nSlayer lvl %slayer (%slayXp/%slayMax Xp)\nStamina lvl %stamina (%stamXp/%stamMax Xp)"
	  },
	  {
		"textures": "textures/items/book_written.png",
		"name": "Rules",
		"description": "You must follow this rule if you don't wanna got banned\n1. No cheating\n2. No Toolbox\n3. No grief\n4. No glitching"
	  }
	]
}

// [ID] UI dari respawn anchor disable
// [EN] UI from respawn anchor disable
let blockWarning = {
	"title": "Block has been banned in this dimension",
	"body": "You can't use this block in here",
	"button": "Ok"
}