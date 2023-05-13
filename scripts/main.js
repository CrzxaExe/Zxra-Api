import { Player, world, system, Scoreboard, DynamicPropertiesDefinition, MinecraftEntityTypes } from "@minecraft/server";
import { MessageFormData } from "@minecraft/server-ui"
let worldNotif = false;

// CrzxaExe3
// Jangan ganti sembarangan code dibawah ini kecuali yg udah gw kasih keterangan
world.events.worldInitialize.subscribe((event) => {
    const propertiDefinition = new DynamicPropertiesDefinition();
});

world.events.beforeChat.subscribe(async (event) => {
    const commandTag = "+";
    const pesan = event.message;
    const sender = event.sender;
    if (pesan.startsWith(commandTag)) {
        switch (pesan) {
            case `+help`:
                let helps = "§7All commands: "
                cmd.forEach((data) => {
                	helps += `\n§7+${data.name} - ${data.description}`
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
                }, 2)
                break;
            default:
                sender.sendMessage("§4Please type +help for see all command");
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
    // Warna yg tersedia tapi bisa aja langsung pake §
	var colour = {
	 "green": "§2",
	 "bold_green": "§2§l",
	 "red": "§4",
	 "bold_red": "§4§l",
	 "cyan": "§b",
	 "bold_cyan": "§b§l",
	 "indigo": "§3",
	 "bold_indigo": "§3§l",
	 "purple": "§5",
	 "bold_purple": "§5§l",
	 "blue": "§1",
	 "bold_blue": "§1§l",
	 "orange": "§6",
	 "bold_orange": "§6§l",
	 "yellow": "§e",
	 "bold_yellow": "§e§l",
	 "light_grey": "§7",
	 "bold_light_grey": "§7§l"
	}
	return name = colour[name]
}

let warning = new MessageFormData()
.title("Block placed warning")
.body("That item are banned when used in here")
.button1("Ok")
.button2("Ok")

let rules = new MessageFormData()
.title("Rules")//Judul rules
.body("You must follow this rule if you don't wanna got banned\n1. No cheating\n2. No Toolbox\n3. No grief\n4. No glitching")// isi rules
.button1("Yess Sir")// button yg atas
.button2("Okeh")// button yg bawah

// Kebanyakan di sini boleh diganti
// Bisa ditambahkan aja itu tag apa aja biar chatnya beda
var Tags = {
 "Admin": "green",
 "Zxra": "§b§l",
 "Owner": "bold_purple"
}

// Ini bagian daftar custom command
var cmd = [
 {
   "name": "balance",
   "description": "See your balance(not done yeet)"
 },
 {
   "name": "buy",
   "description": "Buy some item in the shop(not done yeet)"
 },
 {
   "name": "gmc",
   "description": "Change your gamemode to Creative"
 },
 {
   "name": "gms",
   "description": "Change your gamemode to Survival"
 },
 {
   "name": "help",
   "description": "See all command that works"
 },
 {
   "name": "home",
   "description": "Teleport to your home but delay"
 },
 {
   "name": "rules",
   "description": "See rules this world"
 },
 {
   "name": "tags",
   "description": "See all tags that you have"
 }
]