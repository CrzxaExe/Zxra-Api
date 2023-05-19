import { Player, world, system, Scoreboard, DynamicPropertiesDefinition, MinecraftEntityTypes } from "@minecraft/server";
import { MessageFormData, ActionFormData } from "@minecraft/server-ui";
import * as cmd from "./cmd.js";
import * as settings from "./settings.js";
import * as Shop from "./shop.js";

// CrzxaExe3
// [ID] Jangan sembarangan mengubah kode dibawah ini
// [EN] Don't change the code below
if(settings.clearItemEntity.enable == true) {
 system.runInterval(() => {
    let pls = world.getPlayers();
    world.sendMessage(settings.text.clearItem.replace("%time", (Math.floor(settings.clearItemEntity.delay / 20))))
    system.runTimeout (() => {
     pls.forEach(e => {
	  e.runCommand("kill @e[type=item]")
	  world.sendMessage(settings.text.clearItemSuccess)
	 })
	}, settings.clearItemEntity.delay)
 }, settings.clearItemEntity.ticks)
}

system.runInterval(() => {
	let time = world.getTime();
	if(time >= 13000 && time < 13015) world.sendMessage(settings.text.sunset)
	if(time >= 23000 && time < 23015) world.sendMessage(settings.text.sunrise)
	let pxsk = world.getPlayers();
	pxsk.forEach(e => {
		if(!world.scoreboard.getObjective("cash")) e.runCommand("scoreboard objectives add cash dummy Money")
		if(!world.scoreboard.getObjective("slayer")) e.runCommand("scoreboard objectives add slayer dummy slayer")
		if(!world.scoreboard.getObjective("slayXp")) e.runCommand("scoreboard objectives add slayXp dummy slayXp")
		e.runCommand(`scoreboard players add ${e.name} cash 0`)
		e.runCommand(`scoreboard players add ${e.name} slayer 0`)
		e.runCommand(`scoreboard players add ${e.name} slayXp 0`)
		let views = e.getEntitiesFromViewDirection();
		if(settings.option.sneakDisplay == true && e.isSneaking == false) return
	    if(views[0] || views[0] !== undefined) {
			let nameTag = views[0].nameTag;
			let id = views[0].typeId;
			let health = views[0].getComponent("minecraft:health");
			if(!health) { 
              health = { "current": 0, "value": 0 }
            }
			let atkc = views[0].getComponent("minecraft:attack");
			if(!atkc) {
             atkc = { "damage": 0 }
            }
            let tame = "\nCan be tamed";
            if(!views[0].getComponent("minecraft:tameable")) tame = "";
            let tamed = "\nHas owner";
            if(!views[0].getComponent("minecraft:is_tamed")) tamed = "";
            let isBaby = "\nBaby Mob";
            if(!views[0].getComponent("minecraft:is_baby")) isBaby = "";
			let entity = `${nameTag}\n§7${id}\n${Math.round(health.current)}/${health.value} HP${isBaby}${tame}${tamed}`;
			e.runCommand(`title ${e.name} actionbar ${entity}`)
		}
	})
}, 10)

world.events.worldInitialize.subscribe((event) => {
    const propertiDefinition = new DynamicPropertiesDefinition();
});

world.events.playerJoin.subscribe(e => {
	world.sendMessage(settings.text.playerJoin.replace("%user", e.playerName))
})

world.events.entityDie.subscribe(e => {
	let murder = e.damageSource.damagingEntity;
	let corp = e.deadEntity;
	let slayer = world.scoreboard.getObjective("slayer").getScore(murder.scoreboard);
	let slayXp = world.scoreboard.getObjective("slayXp").getScore(murder.scoreboard);
	let earnCash = Math.floor(Math.random() * 4) + Number(slayer);
	let earnXp = Math.floor(Math.random() * 4) + 1;
	let xpMax = Math.floor(100 + (100 * slayer));
	if(murder !== null || murder !== undefined) {
	  murder.runCommand(`scoreboard players add ${murder.name} cash ${earnCash}`)
	  if(slayXp + earnXp > xpMax) {
		let sisa = Math.floor(slayXp + earnXp - xpMax);
		murder.runCommand(`scoreboard players set ${murder.name} slayXp ${sisa}`)
		murder.runCommand(`scoreboard players add ${murder.name} slayer 1`)
		murder.sendMessage(settings.text.levelUp.replace("%skill", "Slayer"))
	  } else murder.runCommand(`scoreboard players add ${murder.name} slayXp ${earnXp}`)
	  murder.runCommand(`title ${murder.name} actionbar Earns $${earnCash} & ${earnXp} Xp`)
	}
})

world.events.blockBreak.subscribe(e => {
})

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
                	 helps += `\n§d[WIP] +${data.name} - ${data.description}`
                    } else helps += `\n§7+${data.name} - ${data.description}`
                })
                sender.sendMessage(helps);
                break;
            case `+gmc`:
                if (sender.hasTag("Admin")) {
                	sender.runCommand("gamemode c")
                    sender.sendMessage("You are in creative mode now")
                } else {
                	sender.sendMessage(settings.text.notAdmin)
            	}
                break;
            case `+gms`:
                if (sender.hasTag("Admin")) {
                	sender.runCommand("gamemode s")
                    sender.sendMessage("You are in survival mode now")
                } else {
                	sender.sendMessage(settings.text.notAdmin)
            	}
                break;
            case `+buy`:
                let cash = JSON.stringify(world.scoreboard.getObjective("cash").getScore(sender.scoreboard));
                let amount = Number(msg[2]);
                if(!amount || amount == undefined || amount == null) amount = 1;
                if(Object.keys(Shop.item).includes(msg[1])) {
		          let total = Math.floor(Shop.item[msg[1]] * amount);
		          if(cash >= total) {
			        sender.runCommand(`give ${sender.name} ${msg[1]} ${amount}`)
			        sender.runCommand(`scoreboard players remove ${sender.name} cash ${total}`)
			        sender.sendMessage(settings.text.buy.replace("%item", msg[1]).replace("%price", total))
		          } else sender.sendMessage(settings.text.noMoney.replace("%item", msg[1]).replace("%price", total))
                } else sender.sendMessage(settings.text.noItem)
                break;
            case `+shop`:
                let shops = "Shop items:"
                Object.keys(Shop.item).forEach(e => {
                	shops += `\n> ${e} $${Shop.item[e]}`
                })
                sender.sendMessage(shops)
                break;
            case `+balance`:
            case `+bal`:
                let bal = JSON.stringify(world.scoreboard.getObjective("cash").getScore(sender.scoreboard));
                sender.sendMessage(`Your current balance is $${bal}`)
                break;
            case `+tags`:
                let tags = sender.getTags();
                sender.sendMessage(`Your tags: ${tags}`)
                break;
            case `+home`:
                let homes = sender.getSpawnPosition();
                if (homes == undefined) homes = world.getDefaultSpawnPosition();
                sender.sendMessage(`§7${settings.text.homeTeleport}`)
                system.runTimeout(() => {
                	sender.runCommand(`tp ${sender.name} ${homes.x} ${homes.y} ${homes.z}`)
                    sender.sendMessage(`§2${settings.text.homeSuccess}`)
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
            case `+menu`:
                sender.runCommand("damage @s 0 magic")
                let menuCom = new ActionFormData()
                system.runTimeout(() => {
                	menu.show(sender).then(r => {
                	  if(r.canceled) return
                      let res = r.selection;
                      switch(res) {
                      	case 0:
                            let fdl = world.scoreboard.getObjective("slayXp").getScore(sender.scoreboard);
                            let dgf = world.scoreboard.getObjective("slayer").getScore(sender.scoreboard);
                            let slayMax = Math.floor(100 + (100 * dgf));
                            let rank = "[Guest]";
                            if(Object.keys(settings.Tags).includes(sender.getTags()[0])) rank = `[${Color(settings.Tags[sender.getTags()[0]])}${sender.getTags()[0]}§r]`;
                            menuCom.title(settings.menu.button[res].name)
                            menuCom.body(settings.menu.button[res].description.replace("%money", world.scoreboard.getObjective("cash").getScore(sender.scoreboard)).replace("%slayer", dgf).replace("%slayXp", fdl).replace("%slayMax", slayMax).replace("%rank", rank))
                            menuCom.button("Close")
                            menuCom.show(sender)
                            break;
                      }
                	}).catch(e => {
                	  console.warn(e, e.stack)
                	})
                }, 3)
                break;
            case `+rank`:
                if(msg[1] == "check") {
                  if (Object.keys(settings.Tags).includes(sender.getTags()[0])) {
                  	sender.sendMessage(`There is a rank on you ${sender.getTags()[0]}`)
                  } else sender.sendMessage(`§7${settings.text.rankWrong}`)
                } else if(msg[1] == "list") {
                  let rankList = "List of rank:"
                  Object.keys(settings.Tags).forEach(data => {
                	rankList += `\n- [${Color(settings.Tags[data])}${data}§r]`
                   })
                   sender.sendMessage(rankList)
                } else sender.sendMessage(settings.text.rank)
                break;
            default: sender.sendMessage(`§c${settings.text.cmdErr}`);
        }
    } else {
    let Rank = sender.getTags();
    if(Object.keys(settings.Tags).includes(Rank[0])) {
    	world.sendMessage({rawtext: [{text: `[${Color(settings.Tags[Rank[0]])}${Rank[0]}§r] ${Color(settings.Tags[Rank[0]])}${sender.name}§r > ${pesan}`}]})
    } else {
    	world.sendMessage({rawtext: [{text: `[Guest] ${sender.name} > ${pesan}`}]})
    }}
    event.cancel = true;
});

world.events.itemStartUseOn.subscribe(event => {
	let entity = event.source;
	let item = event.item;
	let block = entity.getBlockFromViewDirection();
	if (entity instanceof Player) {
		if (settings.option.respawnAnchor == true) {
		 if (item.typeId == "minecraft:glowstone" && block.typeId == "minecraft:respawn_anchor") {
			if (entity.dimension.id == "minecraft:overworld" || entity.dimension.id == "minecraft:the_end") {
			 warning.show(entity).then(r => {
				if (r.canceled) return
			 }).catch(e => {
				console.error(e, e.stack)
			 })
			 entity.runCommand(`setblock ${block.x} ${block.y} ${block.z} air`)
			}
		 }
		}
	}
})

world.events.weatherChange.subscribe(e => {
	if(e.raining == true && e.lightning == false) world.sendMessage(settings.text.weatherRain)
	if(e.lightning == true) world.sendMessage(settings.text.weatherThunder)
})

world.events.beforeItemUse.subscribe(event => {
	let entity = event.source;
	let item = event.item;
	var Swords = [ "minecraft:netherite_sword", "minecraft:diamond_sword", "minecraft:gold_sword", "minecraft:iron_sword", "minecraft:stone_sword", "minecraft:wooden_sword" ];
	if (entity instanceof Player) {
		if (item.typeId == "minecraft:book" && item.nameTag == settings.option.itemBookRulesName) {
		 rules.show(entity).then(r => {
			 if (r.canceled) return
		 }).catch(e => {
			 console.error(e, e.stack)
		 })
		}
		if(Swords.includes(item.typeId)) {
			// entity.runCommand(`execute as ${entity.name} run damage @e[r=2,name=!${entity.name}] 7 entity_attack entity ${entity.name}`)
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
.title(settings.blockWarning.title)
.body(settings.blockWarning.body)
.button1(settings.blockWarning.button1)
.button2(settings.blockWarning.button2)

let rules = new MessageFormData()
.title(settings.rules.title)
.body(settings.rules.body)
.button1(settings.rules.button1)
.button2(settings.rules.button2)

let menu = new ActionFormData()
.title(settings.menu.title)
.body(settings.menu.description)
.button(settings.menu.button[0].name, settings.menu.button[0].textures)