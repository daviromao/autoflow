import { ColorStatus, Semaphore } from "../classes/semaphore";
import { Colors, getColor } from "./colors";

const semaphores: Semaphore[] = [];
const timeOpen = 20000;
const timeToRemoveCar = 1500;

async function main() {
  await fetchSemaphores();

  for (const semaphore of semaphores) {
    console.log(
      `${getColor(semaphore.description.split("-")[1] as any)}[•]${
        Colors.END
      } ${semaphore.description.replace("-", " ")}: ${semaphore.fator}${
        Colors.END
      } `
    );
  }

  console.log("\n");

  setInterval(() => {
    for (const semaphore of semaphores) {
      semaphore.carCount += Math.floor(Math.random() * semaphore.fator) + 1;
    }
  }, 6000);
}

async function fetchSemaphores() {
  const res = await fetch(
    "http://10.10.10.104:8000/discovery/resources?capability=semaphore"
  );

  const resources = ((await res.json()) as any).resources as any;

  for (const resource of resources) {
    semaphores.push({
      uuid: resource.uuid,
      colorStatus: ColorStatus.RED,
      location: { lat: resource.lat, lon: resource.lon },
      carCount: 0,
      emergency: false,
      description: resource.description,
      fator: Math.floor(Math.random() * 3) + 1,
    });
  }
}

async function enableSemaphore(semaphore: Semaphore) {
  semaphore.colorStatus = ColorStatus.GREEN;

  let time = 0;
  while (time < timeOpen) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    time += 500;

    if (time % timeToRemoveCar === 0 && semaphore.carCount > 0) {
      semaphore.carCount = Math.max(semaphore.carCount - 2, 0);
    }
  }
}

async function turnYellow(semaphore: Semaphore) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  semaphore.carCount = semaphore.carCount > 0 ? semaphore.carCount - 1 : 0;

  semaphore.colorStatus = ColorStatus.YELLOW;
}

async function disableSemaphore(semaphore: Semaphore) {
  semaphore.colorStatus = ColorStatus.RED;
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

console.log("STATUS DOS SEMAFOROS\n");

setInterval(() => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  const semaphoresStatus = semaphores.map((semaphore) => {
    return `${getColor(semaphore.colorStatus)}[•]${Colors.END} ${getColor(
      semaphore.description.split("-")[1] as any
    )} ${semaphore.description.replace("-", " ")}: ${semaphore.carCount}${
      Colors.END
    } `;
  });
  process.stdout.write(semaphoresStatus.join(" | "));
});

setInterval(async () => {
  for (const semaphore of semaphores) {
    const body = {
      data: {
        "semaphore-camera": [
          {
            timestamp: new Date().toISOString(),
            value: semaphore.carCount,
          },
        ],
      },
    };
    fetch(`http://10.10.10.104:8000/adaptor/resources/${semaphore.uuid}/data`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => console.log(err));
  }
}, 1000);

main();
