import { csv } from "csvtojson";
const CsvToJson = async (
  filePath,
  setData,
  name,
  startCut = 0,
  finishCut = 3,
  columnData = 2
) => {
  const currentDate = new Date();

  const currentTime = currentDate
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .split(":")[0];

  const getDate = (index) => {
    const day = currentDate.getDate() + index;
    const month = currentDate.getMonth() + 1; // Bulan dimulai dari 0, sehingga perlu ditambah 1
    const year = currentDate.getFullYear();

    return `${day} - ${month} - ${year}`;
  };

  try {
    const response = await fetch(filePath);
    const csvData = await response.text();
    const jsonData = await csv().fromString(csvData);

    let data = jsonData.map((item, index) => {
      const dates = item[Object.keys(item)[0]];
      const date = dates.includes("/")
        ? `${dates.split("/")[1]} - ${dates.split("/")[0]} - ${
            dates.split("/")[2]
          }`
        : dates;
      const hour = item[Object.keys(item)[1]];
      const value = item[Object.keys(item)[columnData]];

      return {
        date: date,
        hour: hour,
        value: parseFloat(parseFloat(value).toFixed(1)),
        isCustomeColor: getDate(index) === getDate(0) ? true : false,
        curentTime: parseInt(currentTime),
      };
    });

    const result = data.reduce((acc, curr) => {
      const existingData = acc.find((item) => item.name === curr.date);
      if (existingData) {
        existingData.hour.push(curr.hour);
        existingData.data[0].data.push(curr.value);
      } else {
        acc.push({
          name: curr.date,
          hour: [curr.hour],
          isCustomeColor: curr.isCustomeColor,
          curentTime: curr.curentTime,
          data: [
            {
              name: name,
              data: [curr.value],
            },
          ],
        });
      }
      return acc;
    }, []);

    setData(result.slice(startCut, finishCut));

    // console.log(result);
  } catch (error) {
    console.error("Error reading CSV file:", error);
  }
};

export default CsvToJson;
