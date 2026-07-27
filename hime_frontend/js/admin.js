async function saveSchedule() {

    const day = document.getElementById("day").value;
    const time = document.getElementById("time").value.trim();
    const title = document.getElementById("title").value.trim();

    if (!time || !title) {
        alert("Please fill in all fields.");
        return;
    }

    try {

        const response = await fetch(
            "https://backend.himehimzvtuber.workers.dev/api/schedule",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    day,
                    time,
                    title
                })
            }
        );

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const result = await response.json();

        if (result.success) {
            alert("Saved successfully!");
        } else {
            alert("Save failed.");
        }

    } catch (error) {

        console.error(error);
        alert("Cannot connect to server.");

    }
}