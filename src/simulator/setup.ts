const semaphores = [
  {
    description: "semaphore-purple",
    capabilities: ["semaphore", "semaphore-camera"],
    status: "active",
    lat: "-23.51589487776733",
    lon: "-47.465608073541446",
  },
  {
    description: "semaphore-cyan",
    capabilities: ["semaphore", "semaphore-camera"],
    status: "active",
    lat: "-23.515657540631693",
    lon: "-47.4655711931671",
  },
  {
    description: "semaphore-green",
    capabilities: ["semaphore", "semaphore-camera"],
    status: "active",
    lat: "-23.51577912049188",
    lon: "-47.46587839196468",
  },
  {
    description: "semaphore-blue",
    capabilities: ["semaphore", "semaphore-camera"],
    status: "active",
    lat: "-23.51604852055936",
    lon: "-47.465888593372455",
  },
];

async function main() {
  for (const resource of semaphores) {
    const sendData = resource;
    const response = await fetch("http://10.10.10.104:8000/adaptor/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: sendData }),
    });
    console.log(response.status);
    const data = ((await response.json()) as any).data;

    const subscription = await fetch(
      "http://10.10.10.104:8000/adaptor/subscriptions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: {
            uuid: data.uuid,
            capabilities: data.capabilities,
            url: `http://10.10.10.1:8000/webhook/${data.uuid}`,
          },
        }),
      }
    );

    console.log(subscription.status);
  }
}

main();
