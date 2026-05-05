let aToken = "";

export const init = (token) => {
  aToken = token;
};

export const log = async (stack, level, pkg, message) => {
  if (!aToken) {
    return;
  }

  try {
    const res = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${aToken}`
      },
      body: JSON.stringify({
        stack: stack,
        level: level,
        package: pkg,
        message: message
      })
    });

    if (!res.ok) {
      console.error("No res: ", res.status);
    } else {
      console.log(`[${stack, level, pkg, message}`);
    }
  } catch (error) {
    console.error("Error in fetch", error);
  }
};