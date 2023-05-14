import { Player, world, system, Scoreboard, DynamicPropertiesDefinition, MinecraftEntityTypes } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui";
import * as cmd from "./cmd.js";
let worldNotif = false;

// CrzxaExe3
// [ID] Jangan sembarangan mengubah kode dibawah ini kecuali saya sudah memberikan keterangannya
// [EN] Don't change the code below carelessly unless I've given you a description
world.events.worldInitialize.subscribe((event) => {
    const propertiDefinition = new DynamicPropertiesDefinition();
});

world.events.beforeChat.subscribe(async (event) => {
    const commandTag = "+";
    const pesan = event.message;
    let msg = pesan.split(" ");
    const sender = event.sender;
    if (pesan.startsWith(commandTag)) {
        switch (msg[0]) {
            case `+help`:
                let helps = "§7All commands: "
                cmd.cmd.forEach((data) => {
                	if(data.done == false) {
                	 helps += `\n§4+${data.name} - ${data.description} [Not Done]`
                    } else helps += `\n§7+${data.name} - ${data.description}`
                })
                sender.sendMessage(helps);
                break;
            case `+gmc`:
                if (sender.hasTag("Admin")) {
                	sender.runCommand("gamemode c")
                    sender.sendMessage("You are in creative mode now")
                } else {
                	sender.sendMessage("You are not admin")
            	}
                break;
            case `+gms`:
                if (sender.hasTag("Admin")) {
                	sender.runCommand("gamemode s")
                    sender.sendMessage("You are in survival mode now")
                } else {
                	sender.sendMessage("You are not admin")
            	}
                break;
            case `+buy`:
                break;
            case `+balance`:
            case `+bal`:
                let bal = event.getScore("cash", sender.name);
                sender.sendMessage(`Your current balance is $${bal}`)
                break;
            case `+tags`:
                let tags = sender.getTags();
                sender.sendMessage(`Your tags: ${tags}`)
                break;
            case `+home`:
                let homes = sender.getSpawnPosition();
                if (homes == undefined) homes = world.getDefaultSpawnPosition();
                sender.sendMessage("§7Teleporting in 3 seconds...")
                system.runTimeout(() => {
                	//sender.teleport(homes)
                	sender.runCommand(`tp ${sender.name} ${homes.x} ${homes.y} ${homes.z}`)
                    sender.sendMessage("§2Succes back to home")
                }, 60)
                break;
            case `+rules`:
                sender.runCommand("damage @s 0 magic")
                system.runTimeout(() => {
                 rules.show(sender).then(r => {
                 	if(r.canceled) return
                 }).catch(e => {
                 	console.warn(e, e.stack)
                 })
                }, 3)
                break;
            case `+rank`:
                if(msg[1] == "check") {
                  if (Object.keys(Tags).includes(sender.getTags()[0])) {
                  	sender.sendMessage(`There is a rank on you ${sender.getTags()[0]}`)
                  } else sender.sendMessage("§7There is no rank with in you")
                } else if(msg[1] == "list") {
                  let rankList = "List of rank:"
                  Object.keys(Tags).forEach(data => {
                	rankList += `\n- [${Color(Tags[data])}${data}§r]`
                   })
                   sender.sendMessage(rankList)
                } else sender.sendMessage("Rank subcommand list\n- check\n- list")
                break;
            default: sender.sendMessage("§4Please type +help for see all command");
        }
    } else {
    let Rank = sender.getTags();
    if(Object.keys(Tags).includes(Rank[0])) {
    	world.sendMessage({rawtext: [{text: `[${Color(Tags[Rank[0]])}${Rank[0]}§r] ${Color(Tags[Rank[0]])}${sender.name}§r > ${pesan}`}]})
    } else {
    	world.sendMessage({rawtext: [{text: `[Guest] ${sender.name} > ${pesan}`}]})
    }}
    event.cancel = true;
});

world.events.blockPlace.subscribe(event => {
	let entity = event.player;
	let block = event.block;
	let dimension = event.dimension;
	if (entity instanceof Player) {
		if (block.typeId == "minecraft:respawn_anchor") {//&& dimension == "overworld" || dimension == "end") {
			warning.show(entity).then(r => {
				if (r.canceled) return
			}).catch(e => {
				console.error(e, e.stack)
			})
			event.cancel = true
		}
	}
})

world.events.beforeItemUse.subscribe(event => {
	let entity = event.source;
	let item = event.item;
	if (entity instanceof Player) {
		if (item.typeId == "minecraft:book" && item.nameTag == "Rules") {
		 rules.show(entity).then(r => {
			 if (r.canceled) return
		 }).catch(e => {
			 console.error(e, e.stack)
		 })
		}
	}
})

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

let warning = new MessageFormData()
.title("Block placed warning")// Judul warning - Warning title
.body("That item are banned when used in here")// Isi warning - Warning description
.button1("Ok")
.button2("Ok")

let rules = new MessageFormData()
.title("Rules")// Judul rules - Rules title
.body("You must follow this rule if you don't wanna got banned\n1. No cheating\n2. No Toolbox\n3. No grief\n4. No glitching")// isi rules - Rules description
.button1("Yess Sir")// Button yg atas - Button top
.button2("Okeh")// Button yg bawah - Button bottom

// [ID] Kebanyakan di sini boleh diganti atau di tambahkan
// >>>> Bisa ditambahkan aja itu tag apa aja biar chatnya beda
// [EN] Most here can be replaced or be added new
// >>>> Most of them here can be changed. Can you add any tags so that the chat is different
var Tags = {
 "Admin": "green",
 "Zxra": "§b§l",
 "Owner": "bold_purple"
}

// Custom command list on "cmd.js"