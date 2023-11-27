import { ColorStatus, Semaphore } from "../classes/semaphore";
import { Colors, getColor } from "./colors";
import express, { Request, Response } from "express";

const semaphores: Semaphore[] = [];
let timeAux = new Date();

export async function setupDevices() {
  await fetchSemaphores();

  for (const semaphore of semaphores) {
    console.log(
      `${getColor(semaphore.description.split("-")[1] as any)}[•]${
        Colors.END
      } ${semaphore.description.replace("-", " ")}: ${semaphore.fator}${
        Colors.END
      } fator`
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

setInterval(async () => {
  for (const semaphore of semaphores) {
    switch (semaphore.colorStatus) {
      case ColorStatus.GREEN:
        await handleGreen(semaphore);
        break;
      case ColorStatus.YELLOW:
        handleYellow(semaphore);
        break;
      case ColorStatus.RED:
        break;
    }
  }
}, 500);

async function handleGreen(semaphore: Semaphore) {
  if (timeAux.getTime() + 3000 < new Date().getTime()) {
    semaphore.carCount = Math.max(semaphore.carCount - 2, 0);
    timeAux = new Date();
  }
}

async function handleYellow(semaphore: Semaphore) {
  semaphore.carCount = semaphore.carCount > 0 ? semaphore.carCount - 1 : 0;
}

console.log("STATUS DOS SEMAFOROS");

if (1) {
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
  }, 500);
}

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
}, 500);

setupDevices();

const app = express();
const port = 8000;

app.use(express.json());

app.post("/webhook/:uuid", (req: Request<{ uuid: string }>, res: Response) => {
  for (const semaphore of semaphores) {
    if (semaphore.uuid === req.params.uuid) {
      semaphore.colorStatus = req.body.command.value;
      if (semaphore.colorStatus === ColorStatus.GREEN) {
        timeAux = new Date();
      }
      break;
    }
  }
  res.status(200).send("Webhook recebido com sucesso!");
});

app.listen(port, () => {
  console.log(`RECEBIMENTO DE COMANDOS HABILITADOS\n`);
});
