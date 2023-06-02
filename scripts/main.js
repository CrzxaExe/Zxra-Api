import { Player, world, system, MinecraftEntityTypes } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { Color, setup } from "./function.js";
import * as cmd from "./cmd.js";
import * as settings from "./settings.js";
import * as Shop from "./shop.js";

// CrzxaExe3
// [ID] Jangan sembarangan mengubah kode dibawah ini
// [EN] Don't change the code below
function getActor(){
	let actor;
	for(let actor_type of world.getDimension("minecraft:overworld").getEntitiesAtBlockLocation({x:0, y:320, z:0})){
		if(actor_type.typeId == "cz:config_loader"){
			actor = actor_type;
			return actor;
		}
	}
	return actor;
}

function getConfigFromActor(){
	let l = {};
	let actor = getActor();
	if(actor == undefined) return {};
	for(let a of actor.getTags()){
		let b = a.split("=");
		l[b[0]] = b[1];
	}
	return l;
}

world.events.worldInitialize.subscribe(s => {
	world.getDimension("minecraft:overworld").runCommandAsync("tickingarea add circle 0 320 0 1 config_actor_ticking");
});

let unload = true;
let load_repeat = 0;

let unload_id = system.runInterval(() => {
	if(world.getDimension("minecraft:overworld").getEntities({ location: {x:0, y:320, z:0}, maxDistance: 1, type: "cz:config_loader"}).length == 0){
		console.warn("Cannot found actor, try again");
	}else{
		console.warn("Actor founded");
		unload = false;
		system.clearRun(unload_id);
		return;
	}
	
	if(load_repeat > 5){
		console.warn("No Actor Detected");
		unload = false;
		system.clearRun(unload_id);
	}
	
	load_repeat++;
}, 40);

system.events.scriptEventReceive.subscribe( s => {
	let config = getConfigFromActor();
	world.sendMessage(config)
}, { namespaces: [ "config_loaded" ]});

system.events.scriptEventReceive.subscribe(s => {
	for(let pls of world.getPlayers()) {
	 pls.onScreenDisplay.setTitle(s.message, {fadeInSeconds: 0, fadeOutSeconds: 0, staySeconds: 0})
	}
}, { namespaces: [ "ui" ]})

system.runInterval(() => {
	for(let user of world.getPlayers()) {
		let stam = world.scoreboard.getObjective("stam").getScore(user.scoreboard)
        let cash = world.scoreboard.getObjective("cash").getScore(user.scoreboard)
		user.runCommand(`scriptevent ui:cz Stamina: ${stam}`)
		user.runCommand(`scriptevent ui:cz $§2 ${cash}`)
	}
}, 4)

world.events.worldInitialize.subscribe(e => {
	for(let init of world.getPlayers()) {
		setup(init, world)
	}
})

world.events.playerJoin.subscribe(e => {
	for(let join of world.getPlayers()) {
		setup(join, world)
	}
})

system.runInterval(() => {
	if(world.getTime() >= 13000 && world.getTime() < 13010) world.sendMessage(settings.text.sunset)
	if(world.getTime() >= 23000 && world.getTime() < 23010) world.sendMessage(settings.text.sunrise)
	
	for(let e of world.getPlayers()) {
		let vel = e.getVelocity();
		let player_speed = e.getComponent("minecraft:movement");
		let vel_calc = Math.sqrt(Math.pow(vel.x, 2) + Math.pow(vel.z, 2));
		let is_sprint = (vel_calc - player_speed.current*2) > 0.0175;

		if(is_sprint) {
			let stamXp = world.scoreboard.getObjective("stamXp").getScore(e.scoreboard);
			let maxStamina = world.scoreboard.getObjective("stamMax").getScore(e.scoreboard);
			let stam = world.scoreboard.getObjective("stam").getScore(e.scoreboard);
			let stamina = world.scoreboard.getObjective("stamina").getScore(e.scoreboard);
			if(stam >= 10) {
				e.runCommand(`scoreboard players remove ${e.name} stam 1`)
				if(stamXp > (Math.floor(500 + (200 * stamina)))) {
					e.runCommand(`scoreboard players add ${e.name} stamina 1`)
					e.runCommand(`scoreboard players set ${e.name} stamXp ${Math.floor(stamXp - (500 + (200 * stamina)))}`)
					e.runCommand(`scoreboard players set ${e.name} stamMax ${Math.floor(100 + (2 * (stamina + 1)))}`)
					e.sendMessage(settings.text.levelUp.replace("%skill", "Stamina"))
				} else e.runCommand(`scoreboard players add ${e.name} stamXp 1`);
				e.runCommand(`scriptevent ui:cz Stamina: ${stam}`)
			} else e.runCommand(`effect ${e.name} slowness 5 5 true`)
		}
	}
}, 8)

system.runInterval(() => {
	for(let all of world.getPlayers()) {
		let stam = world.scoreboard.getObjective("stam").getScore(all.scoreboard)
		let stamMax = world.scoreboard.getObjective("stamMax").getScore(all.scoreboard)
		
		let vel = all.getVelocity();
		let player_speed = all.getComponent("minecraft:movement");
		let vel_calc = Math.sqrt(Math.pow(vel.x, 2) + Math.pow(vel.z, 2));
		let is_sprint = (vel_calc - player_speed.current*2) > 0.0175;
		
		if(stam++ >= stamMax || is_sprint) return
        all.runCommand(`scoreboard players add ${all.name} stam 1`)
        all.runCommand(`scriptevent ui:cz Stamina: ${stam}`)
    }
}, 60)

world.events.entityDie.subscribe(e => {
	let murder = e.damageSource.damagingEntity;
	if(murder instanceof Player) {
	 //let corp = e.deadEntity;
	 let slayXp = world.scoreboard.getObjective("slayXp").getScore(murder.scoreboard);
	 let earnCash = Math.floor(Math.random() * 4) + Number(world.scoreboard.getObjective("slayer").getScore(murder.scoreboard));
	 let earnXp = Math.floor(Math.random() * 4) + 1;
	 let xpMax = Math.floor(100 + (100 * world.scoreboard.getObjective("slayer").getScore(murder.scoreboard)));

	 if(murder !== null || murder !== undefined) {
	  murder.runCommand(`scoreboard players add ${murder.name} cash ${earnCash}`)
	  if(slayXp + earnXp > xpMax) {
		 murder.runCommand(`scoreboard players set ${murder.name} slayXp ${Math.floor(slayXp + earnXp - xpMax)}`)
		 murder.runCommand(`scoreboard players add ${murder.name} slayer 1`)
		 murder.sendMessage(settings.text.levelUp.replace("%skill", "Slayer"))
	   } else murder.runCommand(`scoreboard players add ${murder.name} slayXp ${earnXp}`)
	   murder.runCommand(`title ${murder.name} actionbar Earns $${earnCash} & ${earnXp} Xp`)
	 }
	}
})

world.events.beforeChat.subscribe(async (event) => {
    let msg = event.message.split(" ");
    const sender = event.sender;
    if (event.message.startsWith("+")) {
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
            case `+setup`:
                setup(sender, world)
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
            case `+home`:
                let homes = sender.getSpawnPosition();
                if (homes == undefined) homes = world.getDefaultSpawnPosition();
                sender.sendMessage(`§7${settings.text.homeTeleport}`)
                system.runTimeout(() => {
                	sender.runCommand(`tp ${sender.name} ${homes.x} ${homes.y} ${homes.z}`)
                    sender.sendMessage(`§2${settings.text.homeSuccess}`)
                }, 60)
                break;
            case `+menu`:
                let menu = new ActionFormData()
                .title(settings.menu.title)
                .body(settings.menu.description)
                .button(settings.menu.button[0].name, settings.menu.button[0].textures)
                .button(settings.menu.button[1].name, settings.menu.button[1].textures)
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
                            let std = world.scoreboard.getObjective("stamina").getScore(sender.scoreboard);
                            let sft = world.scoreboard.getObjective("stamXp").getScore(sender.scoreboard);
                            let slayMax = Math.floor(100 + (100 * dgf));
                            let stamMax = Math.floor(500 + (200 * std));
                            let rank = "[Guest]";
                            if(Object.keys(settings.Tags).includes(sender.getTags()[0])) rank = `[${Color(settings.Tags[sender.getTags()[0]])}${sender.getTags()[0]}§r]`;
                            menuCom.title(settings.menu.button[res].displayName.replace("%s", sender.name))
                            menuCom.body(settings.menu.button[res].description.replace("%money", world.scoreboard.getObjective("cash").getScore(sender.scoreboard)).replace("%slayer", dgf).replace("%slayXp", fdl).replace("%slayMax", slayMax).replace("%rank", rank).replace("%stamina", std).replace("%stamXp", sft).replace("%stamMax", stamMax))
                            menuCom.button("Close")
                            menuCom.show(sender)
                            break;
                          case 1:
                            menuCom.title(settings.menu.button[res].name)
                            menuCom.body(settings.menu.button[res].description)
                            menuCom.button("Close")
                            menuCom.show(sender)
                            break;
                      }
                	})
                }, 3)
                break;
            case `+rank`:
                if(msg[1] == "check") {
                  if (Object.keys(settings.Tags).includes(sender.getTags()[0])) {
                  	sender.sendMessage(`There is a rank on you ${sender.getTags()[0]}`)
                  } else sender.sendMessage(`§7${settings.text.rankWrong}`)
                } else if(msg[1] == "list") {
                  let rankList = "List of rank:";
                  Object.keys(settings.Tags).forEach(data => {
                	rankList += `\n- [${Color(settings.Tags[data])}${data}§r]`
                   })
                   sender.sendMessage(rankList)
                } else sender.sendMessage(settings.text.rank)
                break;
            default: sender.sendMessage(`§c${settings.text.cmdErr}`);
        }
    } else {
    if(Object.keys(settings.Tags).includes(sender.getTags()[0])) {
    	world.sendMessage({rawtext: [{text: `[${Color(settings.Tags[sender.getTags()[0]])}${sender.getTags()[0]}§r] ${Color(settings.Tags[sender.getTags()[0]])}${sender.name}§r > ${event.message}`}]})
    } else {
    	world.sendMessage({rawtext: [{text: `[Guest] ${sender.name} > ${event.message}`}]})
    }}
    event.cancel = true;
});

system.events.beforeWatchdogTerminate.subscribe(e => {
	e.cancel = true
    world.sendMessage("[§l§2CZ§r] Zxra API " + e.terminateReason)
});

world.events.weatherChange.subscribe(e => {
	if(e.raining == true && e.lightning == false) world.sendMessage(settings.text.weatherRain)
	if(e.lightning == true) world.sendMessage(settings.text.weatherThunder)
})