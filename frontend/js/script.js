document.getElementById("uploadForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("csvFile");
    const target = document.getElementById("target").value;

    if (!fileInput.files.length) {
        alert("Please select a CSV file!");
        return;
    }

    Papa.parse(fileInput.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = results.data;

            if (!data[0] || !data[0].hasOwnProperty(target)) {
                document.getElementById("result").innerText = `Error: Target column '${target}' not found`;
                return;
            }

            const rows = data.length;
            const columns = Object.keys(data[0]).length;
            let accuracy = null;

            if (typeof data[0][target] === "number") {
                const sum = data.reduce((acc, row) => acc + row[target], 0);
                accuracy = (sum / rows).toFixed(3);
            }

            const result = {
                "rows": rows,
                "columns": columns,
                "target": target,
                "average_or_placeholder": accuracy || "N/A"
            };

            document.getElementById("result").innerText = JSON.stringify(result, null, 2);
        }
    });
});
