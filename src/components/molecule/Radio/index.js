import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { AiOutlineCheckCircle } from "react-icons/ai";

const plans = [
  {
    id: 1,
    day: 3,
    name: "3 Days Package",
    description: "Enjoy accessing data of your selected location for 3 Days",
  },
  {
    id: 2,
    day: 7,
    name: "7 Days Package",
    description: "Enjoy accessing data of your selected location for 7 Days",
  },
  {
    id: 3,
    day: 14,
    name: "14 Days Package",
    description: "Enjoy accessing data of your selected location for 14 Days",
  },
];

const Radio = ({ disabled, setValue, value }) => {
  const [selected, setSelected] = useState(plans[0]);

  useEffect(() => {
    if (value) {
      setValue({
        ...value,
        package: plans[0],
      });
    }
  }, []);

  return (
    <div className="w-full">
      <div className="mx-auto w-full">
        <RadioGroup
          disabled={disabled}
          value={selected}
          onChange={(event) => {
            setSelected(event);
            setValue({
              ...value,
              package: event,
            });
          }}
        >
          <div className="">
            {plans.map((plan) => (
              <RadioGroup.Option
                key={plan.name}
                value={plan}
                className={({ active, checked }) =>
                  `${active ? "ring-2 ring-white ring-opacity-60" : ""}
                  ${checked ? "bg-[#1F8A70] bg-opacity-75 text-white" : ""}
                  ${disabled ? "cursor-default" : "cursor-pointer"}
                    relative flex px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center gap-8">
                      {checked ? (
                        <div className=" text-white">
                          <AiOutlineCheckCircle className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className=" text-white w-4 h-4 rounded-full border-2 border-white" />
                      )}
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {plan.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? "text-sky-100" : "text-gray-500"
                            }`}
                          >
                            <span className="text-[9px]">
                              {plan.description}
                            </span>{" "}
                          </RadioGroup.Description>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default Radio;
