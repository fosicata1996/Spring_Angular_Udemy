import {CricketCoach} from "./CricketCoach";
import {GolfCoach} from "./GolfCoach";
import {Coach} from "./Coach";

let theCoaches: Coach[] = [];
theCoaches.push(new CricketCoach());
theCoaches.push(new GolfCoach());

for (let currentCoach of theCoaches)
{
    console.log(currentCoach.getDailyWorkout());
}