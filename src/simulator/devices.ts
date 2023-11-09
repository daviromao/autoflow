import { ColorStatus, Semaphore } from "../classes/semaphore";
import { Colors, getColor } from "./colors";

const semaphores: Semaphore[] = [];

async function main() {
  await fetchSemaphores();
  while (true) {
    for (const semaphore of semaphores) {
      const semaphoreColor = getColor(
        semaphore.description.split("-")[1] as any
      );
      await enableSemaphore(semaphore, semaphoreColor);
      await turnYellow(semaphore, semaphoreColor);
      await disableSemaphore(semaphore, semaphoreColor);
      console.log("");
    }
  }
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
    });
  }
}

async function enableSemaphore(semaphore: Semaphore, semaphoreColor: string) {
  console.log(
    `${Colors.GREEN}[•]${Colors.END} Enabling ${
      semaphoreColor + semaphore.description.replace("-", " ") + Colors.END
    }`
  );
  semaphore.colorStatus = ColorStatus.GREEN;

  // time of green light
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

async function turnYellow(semaphore: Semaphore, semaphoreColor: string) {
  console.log(
    `${Colors.YELLOW}[•]${Colors.END} Turning yellow ${
      semaphoreColor + semaphore.description.replace("-", " ") + Colors.END
    }`
  );

  // time of yellow light
  await new Promise((resolve) => setTimeout(resolve, 3000));
  semaphore.colorStatus = ColorStatus.YELLOW;
}

async function disableSemaphore(semaphore: Semaphore, semaphoreColor: string) {
  console.log(
    `${Colors.RED}[•]${Colors.END} Disabling ${
      semaphoreColor + semaphore.description.replace("-", " ") + Colors.END
    }`
  );

  // time of red light
  await new Promise((resolve) => setTimeout(resolve, 5000));
  semaphore.colorStatus = ColorStatus.RED;
}

main();
