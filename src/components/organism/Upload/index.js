import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

//  assets
import { BsFileEarmarkCheck } from "react-icons/bs";

// custom function
import { convert, times, namefile } from "@hooks/data";

export function Upload({ isPrakiraan = false, close }) {
  const { token } = useSelector((state) => state.auth);
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setFile(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const SuccessNotif = () => toast.success("Sukses, upload file");
  const FailNotif = () => toast.error("Gagal, upload file");
  const WarningNotif = () => toast.warning("Peringatan, file sudah ada");

  // value state for store information
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [type, setType] = useState({
    val: isPrakiraan ? "prakiraan" : "",
    name: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const [time, setTime] = useState({
    tanggal: "00",
    bulan: "00",
    tahun: "",
  });

  const [progress, setProgress] = useState(0);
  const [upload, setUpload] = useState(false);

  const types = [
    { val: "historis-bulanan", name: "Bulanan" },
    { val: "historis-tahunan", name: "Tahunan" },
  ];

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      let precentage = Math.floor((loaded * 100) / total);
      setProgress(precentage);
    },
  };

  const formData = new FormData();
  formData.append("tanggal", time.tanggal);
  formData.append("bulan", time.bulan);
  formData.append("tahun", time.tahun);
  formData.append("jenis", type.val);
  formData.append("typename", name);

  const formUpload = new FormData();
  formUpload.append("tanggal", time.tanggal);
  formUpload.append("bulan", time.bulan);
  formUpload.append("tahun", time.tahun);
  formUpload.append("jenis", type.val);
  formUpload.append("typename", name);
  formUpload.append("file", file);

  const uploadFile = async () => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_UPLOAD + "/checkfile_exist",
        formData,
        config
      );

      !data.exists && setUpload(true);

      if (data.exists) {
        WarningNotif();
      } else {
        setIsSubmit(true);
        await axios
          .post(
            process.env.REACT_APP_UPLOAD + "/analyze_file",
            formUpload,
            config
          )
          .then((data) => {
            // if (data.data.status === "SUCCES") {
            SuccessNotif();
            setUpload(false);
            setTimeout(() => {
              close();
            }, 7000);
            setIsSubmit(false);
            // } else {
            //   FailNotif();
            //   setUpload(false);
            //   setIsSubmit(false);
            // }
          })
          .catch((err) => {
            console.log(err);
            FailNotif();
            setUpload(false);
          });
      }
    } catch (error) {
      setIsSubmit(false);
      console.log(error);
    }
  };

  const data =
    "0	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25	26	27	28	29	30	31	32	33	34	35	36	37	38	39	40	41	42	43	44	45	46	47	48	49	50	51	52	53	54	55	56	57	58	59	60	61	62	63	64	65	66	67	68	69	70	71	72	73	74	75	76	77	78	79	80	81	82	83	84	85	86	87	88	89	90	91	92	93	94	95	96	97	98	99	100	101	102	103	104	105	106	107	108	109	110	111	112	113	114	115	116	117	118	119	120	123	126	129	132	135	138	141	144	147	150	153	156	159	162	165	168	171	174	177	180	183	186	189	192	195	198	201	204	207	210	213	216	219	222	225	228	231	234	237	240	243	246	249	252	255	258	261	264	267	270	273	276	279	282	285	288	291	294	297	300	303	306	309	312	315	318	321	324	327	330	333	336	339	342	345	348	351	354	357	360	363	366	369	372	375	378	381	384";
  const data2 = data.split("\t");
  const data3 = data2.map(Number);

  return (
    <>
      <ToastContainer />
      <h1 className="font-semibold text-4xl py-5 cursor-pointer">
        Unggah Data {isPrakiraan ? "Prakiraan" : "Historis"}
      </h1>

      <div className="w-full h-[75vh] bg-white shadow-lg rounded-lg p-10 flex justify-between">
        {/* Upload Wrapper */}
        <div
          {...getRootProps()}
          className="h-full w-[47.5%] bg-[#F7FFF4] rounded-lg border-2 border-slate-200 border-dashed flex flex-col justify-center items-center cursor-pointer relative"
        >
          <input id="fileupload" {...getInputProps()} />

          {file && <BsFileEarmarkCheck className="text-6xl mb-4" />}

          <h2 className="text-center">
            {file ? (
              <>
                {file.name} <br />{" "}
                <b className="text-xl">{convert(file.size)}</b>
              </>
            ) : (
              "Seret berkas atau pencet untuk mengunggah"
            )}
          </h2>
          {!file && (
            <button className="px-8 py-2 rounded-lg bg-[#00AF50] hover:bg-[#1a7442] hover:text-white mt-3 italic">
              Pilih Berkas
            </button>
          )}

          {upload && (
            <div className="w-full px-3 absolute bottom-5">
              <h1 className="text-green-500">Progress Unggahan</h1>
              <div className="w-full bg-slate-600 rounded-full h-6 dark:bg-gray-700">
                <div
                  className={`bg-green-600 h-6 rounded-full text-center`}
                  style={{ width: progress + "%" }}
                >
                  {progress}%
                </div>
              </div>
            </div>
          )}
        </div>
        {/* End of Upload Wrapper */}

        {/* Menu Form */}
        <div className="h-full w-[47.5%] flex flex-col justify-between">
          <div>
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="type" className="font-medium text-lg">
                Tipe
              </label>
              {isPrakiraan ? (
                <select
                  name="type"
                  disabled
                  id="type"
                  className="shadow-lg border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                  defaultValue="prakiraan"
                >
                  <option value="prakiraan">Prakiraan</option>
                </select>
              ) : (
                <select
                  name="type"
                  id="type"
                  className="shadow-lg border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                  onChange={(e) => {
                    setType({
                      val: e.target.value,
                      name: e.target.value.includes("bulan")
                        ? "Bulanan"
                        : "Tahunan",
                    });
                  }}
                  defaultValue=""
                >
                  <option value="">Tipe</option>
                  {types.map((item, index) => (
                    <option key={index} value={item.val}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {/* End of Tipe */}

            {/* Name */}
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="name" className="font-medium text-lg">
                Nama
              </label>
              <select
                defaultValue={""}
                className="shadow-lg border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              >
                <option hidden value={""}>
                  Nama
                </option>
                {isPrakiraan && (
                  <>
                    <option value={""} disabled className="text-green-500">
                      ---- Harian ---
                    </option>
                    {namefile.harianPrakiraan.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                    <option value={""} disabled className="text-green-500">
                      ---- Bulanan ---
                    </option>
                    {namefile.bulananPrairaan.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </>
                )}

                {type.name === "Bulanan" &&
                  namefile.bulanan.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}

                {type.name === "Tahunan" &&
                  namefile.tahunan.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>
            {/* End of Name */}

            {/* Tipe */}

            {/* Time */}
            <div className="flex flex-col gap-2 mb-4">
              <label htmlFor="time" className="font-medium text-lg">
                Waktu
              </label>

              {type.name === "" && !isPrakiraan && (
                <select
                  name="time"
                  id="time"
                  disabled={!type.name ? true : false}
                  className="shadow-lg border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                  defaultValue=""
                >
                  <option value="">Waktu</option>
                </select>
              )}

              {type.name === "Bulanan" && (
                <div className="w-full flex items-center justify-between">
                  <select
                    defaultValue={""}
                    className="shadow-lg w-[49%] border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                    onChange={(e) => {
                      setTime({ ...time, bulan: e.target.value });
                    }}
                  >
                    <option value={""}>Bulan</option>

                    {times.bulan.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <select
                    defaultValue={""}
                    className="shadow-lg w-[49%] border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                    onChange={(e) => {
                      setTime({ ...time, tahun: e.target.value });
                    }}
                  >
                    <option value={""}>Tahun</option>

                    {times.tahun.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {isPrakiraan && (
                <div className="w-full flex gap-2 items-center justify-between">
                  <select
                    defaultValue={""}
                    className="shadow-lg w-[32%] border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                    onChange={(e) => {
                      setTime({ ...time, tanggal: e.target.value });
                    }}
                  >
                    <option hidden value={""}>
                      Tanggal
                    </option>

                    {times.tanggal.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <select
                    defaultValue={""}
                    className="shadow-lg w-[32%] border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                    onChange={(e) => {
                      setTime({ ...time, bulan: e.target.value });
                    }}
                  >
                    <option hidden value={""}>
                      Bulan
                    </option>

                    {times.bulan.map((item, index) => (
                      <option value={item.id} key={index}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  <select
                    defaultValue={""}
                    className="shadow-lg w-[32%] border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                    onChange={(e) => {
                      setTime({ ...time, tahun: e.target.value });
                    }}
                  >
                    <option hidden value={""}>
                      Tahun
                    </option>

                    {times.tahun.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <input
                    type="time"
                    className="shadow-lg border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                  />
                </div>
              )}

              {type.name === "Tahunan" && (
                <select
                  name="time"
                  id="time"
                  disabled={type === "" ? true : false}
                  className="shadow-lg border-2 border-[#B4DAD7] rounded-lg h-12 px-4 focus:outline-none"
                  onChange={(e) => {
                    setTime({ ...time, tahun: e.target.value });
                  }}
                  defaultValue=""
                >
                  <option value="">Pilih Tahun</option>

                  {times.tahun.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {/* End of Time */}
          </div>

          <button
            onClick={uploadFile}
            disabled={
              file !== null &&
              name !== "" &&
              type.val !== "" &&
              time.tahun !== ""
                ? false
                : true
            }
            className={`bg-[#00672E] text-white rounded-lg py-3 italic ${
              file !== null &&
              name !== "" &&
              type.val !== "" &&
              time.tahun !== ""
                ? "hover:bg-[#1ead5e]"
                : ""
            } ${isSubmit && "cursor-not-allowed"}`}
          >
            {isSubmit ? (
              <div className="flex items-center justify-center" role="status">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 mr-2 text-gray-200 animate-spin fill-green-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <p>Mengunggah...</p>
              </div>
            ) : (
              "Kirim"
            )}
          </button>
        </div>
        {/* End of Menu Form */}
      </div>
    </>
  );
}
