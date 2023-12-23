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
  const cap1 = await fetch("http://10.10.10.104:8000/catalog/capabilities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "semaphore-camera",
      description: `Capability to sensor of a semaphore camera`,
      capability_type: "sensor",
    }),
  });

  const cap2 = await fetch("http://10.10.10.104:8000/catalog/capabilities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "semaphore",
      description: `Capability to control of a semaphore`,
      capability_type: "actuator",
    }),
  });

  console.log(cap1.status);
  console.log(cap2.status);
  if (cap1.status !== 201 || cap2.status !== 201) {
    console.log("Error creating capabilities");
    return;
  }

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
