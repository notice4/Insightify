document.getElementById("uploadForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("csvFile");
    const target = document.getElementById("target").value;
    const model = document.getElementById("model").value;

    if (!fileInput.files.length) {
        alert("Please select a CSV file!");
        return;
    }

    Papa.parse(fileInput.files[0], {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            const data = results.data;

            if (!data[0] || !data[0].hasOwnProperty(target)) {
                document.getElementById("result").innerText = `Error: Target column '${target}' not found`;
                return;
            }

            const rows = data.length;
            const columns = Object.keys(data[0]).length;

            if (typeof data[0][target] !== "number") {
                const mapping = {};
                let counter = 0;
                data.forEach(row => {
                    const val = row[target];
                    if (!(val in mapping)) mapping[val] = counter++;
                    row[target] = mapping[val];
                });
            }

            let analysisResult = "N/A";

            if (model === "correlation") {
                const correlations = {};
                Object.keys(data[0]).forEach(col => {
                    if (col === target) return;
                    if (typeof data[0][col] === "number") {
                        const meanCol = data.reduce((a,r)=>a+r[col],0)/rows;
                        const meanTarget = data.reduce((a,r)=>a+r[target],0)/rows;
                        let numerator = 0, denomCol = 0, denomTarget = 0;
                        data.forEach(row => {
                            numerator += (row[col]-meanCol)*(row[target]-meanTarget);
                            denomCol += Math.pow(row[col]-meanCol,2);
                            denomTarget += Math.pow(row[target]-meanTarget,2);
                        });
                        const corr = numerator / Math.sqrt(denomCol*denomTarget);
                        correlations[col] = Number.isFinite(corr) ? corr.toFixed(3) : "N/A";
                    }
                });
                analysisResult = correlations;
            } else if (model === "regression") {
                const sum = data.reduce((acc, row) => acc + row[target], 0);
                analysisResult = { mean_target: (sum / rows).toFixed(3) };
            }

            const result = {
                "rows": rows,
                "columns": columns,
                "target": target,
                "selected_model": model,
                "analysis": analysisResult
            };

            document.getElementById("result").innerText = JSON.stringify(result, null, 2);
        }
    });
});
