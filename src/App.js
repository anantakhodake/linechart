import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  YAxis,
} from "recharts";

function App() {
  const [datapoints, setDatapoints] = useState([]);

  const getData = async () => {
    try {
      const resp = await axios.get("https://checkinn.co/api/v1/int/requests");

      const unique = []; // store unique hotels

      resp.data.requests.map((hotelObj, i) => {
        // find length of request associated with each other
        const requestsPerHotel = resp.data.requests.filter(
          (hotel) => hotel.hotel.id === hotelObj.hotel.id
        ).length;

        // remove duplicates hotels
        const isExists = unique.find((obj) => obj.name === hotelObj.hotel.name);

        if (!isExists) {
          unique.push({
            name: hotelObj.hotel.name,
            value: requestsPerHotel,
          });
        }
      });

      setDatapoints(unique);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          color: "green",
          fontSize:"26px"
        }}
      >
        Line Chart
      </h1>

      <ResponsiveContainer width="100%" aspect={3}>
        <LineChart
          data={datapoints}
          width={500}
          height={300}
          margin={{ top: 5, right: 250, left: 250, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" interval={"preserveStart"} />
          <YAxis axisLine={false} />
          <Legend />
          <Tooltip />
          <Line dataKey="value" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default App;
