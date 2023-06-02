export { Color, setup }
function Color(name) {
	if (name.startsWith("§")) return name
    // [ID] Warna yg tersedia tapi bisa aja langsung pake §
    // [EN] Available colors but you can use it directly §
	var colour = {
	 "green": "§2",
	 "bold_green": "§2§l",
	 "dark_red": "§4",
	 "bold__dark_red": "§4§l",
	 "red": "§c",
	 "bold_red": "§c§l",
	 "cyan": "§b",
	 "bold_cyan": "§b§l",
	 "indigo": "§3",
	 "bold_indigo": "§3§l",
	 "purple": "§5",
	 "bold_purple": "§5§l",
	 "light_purple": "§d",
	 "bold_light_purple": "§d§l",
	 "dark_blue": "§1",
	 "bold_dark_blue": "§1§l",
	 "blue": "§9",
	 "bold_blue": "§9§l",
	 "orange": "§6",
	 "bold_orange": "§6§l",
	 "yellow": "§e",
	 "bold_yellow": "§e§l",
	 "gold": "§g",
	 "bold_gold": "§g§l",
	 "grey": "§7",
	 "bold_grey": "§7§l",
	 "dark_grey": "§8",
	 "bold_dark_grey": "§8§l",
	 "white": "§f",
	 "bold_white": "§f§l",
	 "obfuscated": "§k"
	}
	return name = colour[name]
}
function setup(sender, world) {
	if(!sender || !world) return
    if(!world.scoreboard.getObjective("cash")) sender.runCommand("scoreboard objectives add cash dummy Money")
    if(!world.scoreboard.getObjective("slayer")) sender.runCommand("scoreboard objectives add slayer dummy slayer")
	if(!world.scoreboard.getObjective("slayXp")) sender.runCommand("scoreboard objectives add slayXp dummy slayXp")
	if(!world.scoreboard.getObjective("stamina")) sender.runCommand("scoreboard objectives add stamina dummy stamina")
	if(!world.scoreboard.getObjective("stamXp")) sender.runCommand("scoreboard objectives add stamXp dummy stamXp")
	if(!world.scoreboard.getObjective("stam")) sender.runCommand("scoreboard objectives add stam dummy stam")
	if(!world.scoreboard.getObjective("stamMax")) sender.runCommand("scoreboard objectives add stamMax dummy stamMax")
	
    sender.runCommand(`scoreboard players add ${sender.name} cash 0`)
    sender.runCommand(`scoreboard players add ${sender.name} slayer 0`)
	sender.runCommand(`scoreboard players add ${sender.name} slayXp 0`)
	sender.runCommand(`scoreboard players add ${sender.name} stamina 0`)
	sender.runCommand(`scoreboard players add ${sender.name} stam 0`)
    sender.runCommand(`scoreboard players add ${sender.name} stamXp 0`)
	if(!world.scoreboard.getObjective("stamMax").getScore(sender.scoreboard) || world.scoreboard.getObjective("stamMax").getScore(sender.scoreboard) < 100) sender.runCommand(`scoreboard players set ${sender.name} stamMax 100`)
}