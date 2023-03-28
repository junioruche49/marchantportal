import React, { useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Switch from "react-switch";

const FormInput = ({
  label,
  name,
  required,
  errors,
  register,
  type,
  options,
  value,
  format = "",
  Controller,
  control,
  readonly = false,
  readonlyValue,
  toggleInput,
  filteredBy = null,
  filterField = null,
  filteredOptions = {} as any,
  getChildFieldOptions = (a, b) => {},
}) => {
  let inputType: any = null;

  const childOptions = useRef(filteredOptions);

  if (!childOptions.current?.name) {
    childOptions.current = filteredOptions;
  }

  if (childOptions.current.name == filteredOptions.name) {
    childOptions.current = filteredOptions;
  }

  const _handleSelect = (e: any) => {
    // if (filteredBy != null) return;
    getChildFieldOptions(name, e.target.value);
  };

  switch (type) {
    case "text":
      inputType = (
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-last-name"
          type="text"
          ref={register({ required: required && !readonlyValue })}
          name={name}
          defaultValue={value}
          readOnly={readonlyValue ? readonlyValue : readonly}
        />
      );
      break;
    case "email":
      inputType = (
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-last-name"
          type="email"
          ref={register({ required: required && !readonlyValue })}
          name={name}
          defaultValue={value}
          readOnly={readonlyValue ? readonlyValue : readonly}
        />
      );
      break;
    case "boolean":
      let newValue = !readonlyValue;
      inputType = (
        <Switch name={name} onChange={toggleInput} checked={newValue} />
        // <div className="flex ">
        //   <label className="flex items-center cursor-pointer">
        //     <div className="relative">
        //       <input
        //         id="toogleA"
        //         type="checkbox"
        //         name={name}
        //         className="hidden"
        //         defaultChecked={value}
        //         ref={register({})}
        //         onClick={(e) => toggleInput(e)}
        //       />
        //       <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
        //       <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
        //     </div>
        //   </label>
        // </div>
      );
      break;
    case "mobile":
    case "phone":
      inputType = (
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-last-name"
          type="tel"
          ref={register({ required: required && !readonlyValue })}
          name={name}
          defaultValue={value}
          readOnly={readonlyValue ? readonlyValue : readonly}
        />
      );
      break;
    case "number":
      inputType = (
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-last-name"
          type="number"
          ref={register({ required: required && !readonlyValue })}
          name={name}
          defaultValue={value}
          readOnly={readonlyValue ? readonlyValue : readonly}
        />
      );
      break;
    case "date":
      if (format === "Y") {
        if (value) {
          var d = new Date();
          d.setFullYear(value);
          inputType = (
            <Controller
              control={control}
              name={name}
              rules={{ required }}
              defaultValue={d}
              render={({ onChange, onBlur, value }) => (
                <ReactDatePicker
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                  showYearPicker
                  yearItemNumber={9}
                  dateFormat="yyyy"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              )}
            />
          );
        } else {
          inputType = (
            <Controller
              control={control}
              name={name}
              rules={{ required }}
              // defaultValue={d}
              render={({ onChange, onBlur, value }) => (
                <ReactDatePicker
                  onChange={onChange}
                  onBlur={onBlur}
                  selected={value}
                  showYearPicker
                  yearItemNumber={9}
                  dateFormat="yyyy"
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                />
              )}
            />
          );
        }
      } else {
        inputType = (
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-last-name"
            type="date"
            ref={register({ required: required && !readonlyValue })}
            name={name}
            // value={value}
            defaultValue={value}
            readOnly={readonlyValue ? readonlyValue : readonly}
          />
        );
      }

      break;
    case "file":
      inputType = (
        <input
          type="file"
          ref={register({ required: required && !readonlyValue })}
          name={name}
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
        // <input
        //   className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        //   id="grid-last-name"
        //   type="date"
        //   ref={register({ required })}
        //   name={name}
        // />
      );
      break;
    case "select":
      inputType = (
        <div className="relative">
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-state"
            ref={register({ required: required && !readonlyValue })}
            name={name}
            disabled={readonlyValue ? readonlyValue : readonly}
            onChange={_handleSelect}
          >
            {!filteredBy ? (
              <>
                <option value="">- Select -</option>
                {options &&
                  options.map((option, key) => {
                    return (
                      <option
                        key={key}
                        value={option.value}
                        selected={option.value === value ? true : false}
                      >
                        {option.label}
                      </option>
                    );
                  })}
              </>
            ) : (
              <>
                {!childOptions.current.options ? (
                  value ? (
                    <option value={value}>
                      {options.find((opt) => opt.value == value)?.label}
                    </option>
                  ) : (
                    <option value=""></option>
                  )
                ) : null}
                {childOptions.current.name == name
                  ? childOptions.current.options.map((opt, key) => (
                      <option
                        key={key}
                        value={opt.value}
                        selected={opt.value === value}
                      >
                        {opt.label}
                      </option>
                    ))
                  : null}
              </>
            )}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 ">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      );
      break;
    default:
      inputType = (
        <input
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-last-name"
          type="text"
          ref={register({ required: required && !readonlyValue })}
          name={name}
          defaultValue={value}
          readOnly={readonlyValue ? readonlyValue : readonly}
        />
      );
      break;
  }

  return (
    <div className="w-full md:w-1/2 px-3 mb-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        {label}
      </label>
      {inputType}
      {errors[name] && errors[name].type === "required" && (
        <p className="text-red-500 text-xs italic">
          Please fill out this field.
        </p>
      )}
    </div>
  );
};

export default FormInput;
