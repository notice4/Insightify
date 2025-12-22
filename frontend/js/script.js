document.getElementById("uploadForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("csvFile");
    const target = document.getElementById("target").value;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("target", target);

    const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    document.getElementById("result").innerText = JSON.stringify(data, null, 2);
});
