export const Html = (
    { tableData }: { tableData: any },
    algorithm: string,
    { ganttData }
  ) => {
    if (!tableData || !tableData.processes) {
      return "Loading...";
    }
  
    const totalDuration = Math.max(
      ...ganttData.map((process) => process.endTime)
    );
  
    return `
        <html>
        <head>
            <style>
                .table {
                    border: 1px solid #ccc;
                    border-collapse: collapse;
                    width: 100%;
                }
                .table-row {
                    display: flex;
                    flex-direction: row;
                }
                .table-cell {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ccc;
                    text-align: center;
                }
                .ganttContainer {
                    display: flex;
                    flex-direction: row;
                    margin-top: 3vw;
                    height: 6.67vw;
                    overflow-x: auto;
                }
                .process {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-width: 1px;
                    border-style: solid;
                    border-color: rgba(0, 0, 0, 1);
                    height: 7.69vw;
                }
                .processtime {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 5px;
                    border-bottom-width: 1px;
                    border-left-width: 1px;
                    border-right-width: 1px;
                    border-top-width: 1px;
                    border-style: solid;
                    border-left-color: rgba(0, 0, 0, 1);
                    border-bottom-color: rgba(0, 0, 0, 1);
                    height: 2.5vw;
                    margin-top: 0.12vw;
                }
                .processText {
                    color: white;
                    font-weight: bold;
                }
                .processText2 {
                    color: black;
                    font-weight: 500;
                    font-size: 1vw;
                }
            </style>
        </head>
        <body>
            <h1>Process Scheduler</h1>
            <h2 class="algo">${algorithm}</h2>
            <div class="table">
                <div class="table-row">
                    <div class="table-cell">Process ID</div>
                    <div class="table-cell">Arrival Time</div>
                    <div class="table-cell">Burst Time</div>
                    <div class="table-cell">Priority</div>
                    <div class="table-cell">Waiting Time</div>
                    <div class="table-cell">Turnaround Time</div>
                </div>
                ${tableData.processes
                  .map(
                    (process) => `
                <div class="table-row" key="${process.id}">
                    <div class="table-cell">P${process.id}</div>
                    <div class="table-cell">${process.arrivalTime}</div>
                    <div class="table-cell">${process.burstTime}</div>
                    <div class="table-cell">${process.priority}</div>
                    <div class="table-cell">${process.waitingTime}</div>
                    <div class="table-cell">${process.turnaroundTime}</div>
                </div>
                `
                  )
                  .join("")}
                <div class="table-row">
                    <div class="table-cell">Average Waiting Time:</div>
                    <div class="table-cell">${tableData.avgWaitingTime.toFixed(
                      2
                    )}</div>
                </div>
                <div class="table-row">
                    <div class="table-cell">Average Turnaround Time:</div>
                    <div class="table-cell">${tableData.totalTurnaroundTime}</div>
                </div>
            </div>
            <h1>Gantt Chart</h1>
            <div class="ganttContainer">
                ${ganttData
                  .map((process, index) => {
                    const width = ((process.endTime - process.startTime) / totalDuration) * 50;
                    const backgroundColor =
                      process.id === "wait"
                        ? "#ccc"
                        : `hsl(${process.id * 50}, 80%, 50%)`;
                    return `
                    <div style="display: flex; flex-direction: column; width: ${width}%" key="${index}">
                        <div class="process" style="background-color: ${backgroundColor};">
                            <span class="processText">${
                              process.id === "wait" ? "Wait" : `P${process.id}`
                            }</span>
                        </div>
                        <div class="processtime">
                            <span class="processText2">${process.startTime}</span>
                            <span class="processText2">${process.endTime}</span>
                        </div>
                    </div>
                    `;
                  })
                  .join("")}
            </div>
        </body>
        </html>
        `;
  };
  