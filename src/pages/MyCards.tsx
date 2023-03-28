import React, { useState, useEffect, useCallback } from "react";
import { withRouter } from "react-router";
import useAuthStore from "../stores/authStore";
import useProfileStore from "../stores/profileStore";
import { getCards, setDefaultCard, removeCard } from "../clients/cards";

const MyCards = (props: any) => {
  const goToAddCard = () => {
    props.history.push("/cards/add");
  };

  const token = useAuthStore((state) => state.accessToken);
  const profile: any = useProfileStore(useCallback((state) => state.data, []));
  const [isLoading, setLoading] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [wantToDeleteCard, setWantToDeleteCard] = useState(false);
  const [selectedCard, setSelectedCard]: any = useState({});
  const [responseData, setResponse]: any = useState();
  const [responseMessage, setResponseMessage]: any = useState(null);
  const [
    defaultCardResponseMessage,
    setDefaultCardResponseMessage,
  ]: any = useState(null);
  const [
    removeCardResponseMessage,
    setRemoveCardResponseMessage,
  ]: any = useState(null);
  const [incomingStateMessage, setIncomingStateMessage] = useState<
    string | null
  >(() => {
    if (props.location.state && props.location.state.message) {
      return props.location.state.message;
    }
    return null;
  });

  const [errorMsg, setErrorMsg] = useState([]);

  const updateErrors = (errors: []) => {
    setErrorMsg(Object.values(errors).flat());
  };

  const postCardOwner = useCallback(async () => {
    let values = {
      email: profile.e_mail,
    };
    setLoading(true);
    try {
      // let postData = await getCards(token,values);
      const { message, data, success } = await getCards(token, values);

      if (success === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }
      setResponseMessage(message);
      setTimeout(function () {
        setResponseMessage(null);
      }, 3000);
      //   const { data } = postData;
      setResponse(data);
      setErrorMsg([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error && !error.response) {
        let msg = [] as any;
        msg.push("Fatal Error! Please check your network connection or kindly logout and login again.");
        setErrorMsg(msg);
        return;
      }
      if (error && error.response.status === 500) {
        let msg = [] as any;
        msg.push(error.response.data.message);
        setErrorMsg(msg);
        return;
      }
      const {
        response: { data },
      } = error;
      data.errors && updateErrors(data.errors);
    }
  }, [token, profile.e_mail]);

  useEffect(() => {
    if (profile && profile.e_mail) postCardOwner();

    const addCardMessageTimeout = setTimeout(() => {
      setIncomingStateMessage(null);
    }, 8000);

    return () => clearTimeout(addCardMessageTimeout);
  }, [setIncomingStateMessage, profile]);

  const postMakeDefaultCard = async (selectedDefaultCard) => {
    let values = {
      id: selectedDefaultCard,
    };
    setLoading(true);
    try {
      // let postData = await getCards(token,values);
      const { message, data, success } = await setDefaultCard(token, values);

      if (success === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setLoading(false);
        return;
      }
      setDefaultCardResponseMessage(message);
      setTimeout(function () {
        setDefaultCardResponseMessage(null);
        // props.history.push("/cards");
      }, 8000);
      //   const { data } = postData;
      postCardOwner();
      setResponse(data);
      setErrorMsg([]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error && !error.response) {
        let msg = [] as any;
        msg.push("Fatal Error! Please check your network connection or kindly logout and login again.");
        setErrorMsg(msg);
        return;
      }
      if (error && error.response.status === 500) {
        let msg = [] as any;
        msg.push(error.response.data.message);
        setErrorMsg(msg);
        return;
      }
      const {
        response: { data },
      } = error;
      data.errors && updateErrors(data.errors);
    }
  };

  const makeDefaultCard = (id) => {
    postMakeDefaultCard(id);
  };

  const postRemoveCard = async (selectedCard) => {
    let values = {
      id: selectedCard,
    };
    setDeleting(true);
    try {
      // let postData = await getCards(token,values);
      const { message, data, success } = await removeCard(token, values);

      if (success === false) {
        let msg = [] as any;
        msg.push(message);
        setErrorMsg(msg);
        setDeleting(false);
        setWantToDeleteCard(false);
        return;
      }
      setRemoveCardResponseMessage(message);
      setTimeout(function () {
        setRemoveCardResponseMessage(null);
        // props.history.push("/cards");
      }, 8000);
      //   const { data } = postData;
      postCardOwner();
      setResponse(data);
      setErrorMsg([]);
      setLoading(false);
      setWantToDeleteCard(false);
      setDeleting(false);
    } catch (error) {
      setLoading(false);
      if (error && !error.response) {
        let msg = [] as any;
        msg.push("Fatal Error! Please check your network connection or kindly logout and login again.");
        setErrorMsg(msg);
        return;
      }
      if (error && error.response.status === 500) {
        let msg = [] as any;
        msg.push(error.response.data.message);
        setErrorMsg(msg);
        return;
      }
      const {
        response: { data },
      } = error;
      data.errors && updateErrors(data.errors);
    }
  };

  const deleteCard = (id) => {
    postRemoveCard(id);
  };

  const _handleDeleteCard = (cardData) => {
    setWantToDeleteCard(true);
    setSelectedCard(cardData);
  };

  const cardIcon = (type) => {
    switch (type) {
      case "mastercard":
        return "/img/mastercard.png";
      case "visa":
        return "/img/visa.png";
      default:
        return "/img/credit-card.png";
    }
  };

  if (isLoading || !profile.e_mail) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative mt-20">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Please wait while we load your cards...
          </h6>
        </div>
      </>
    );
  }

  if (isDeleting) {
    return (
      <>
        <div className="w-11/12 bg-white rounded py-12 shadow-lg m-auto px-8 relative mt-20">
          <img
            src="/img/loading-gif.gif"
            alt=""
            className="w-1/8 m-auto py-10"
          />
          <h6 className="m-auto text-lg text-gray-700 text-center">
            Please wait while we remove your card...
          </h6>
        </div>
      </>
    );
  }

  return (
    <>
      <main className="md:pl-12">
        <div className="flex ">
          <div className="w-full ">
            <div className="flex items-center mt-10 lg:mt-0">
              <div className="w-8 h-1 bg-blue-700 rounded mr-0 hidden md:block"></div>
              <h4 className="bg-blue-700 md:bg-transparent text-white md:text-gray-700 font-normal md:font-semibold text-md md:text-xl tracking-wide uppercase md:normal-case py-2 px-6 rounded-r-lg">
                My Cards
              </h4>
            </div>
            <br />

            <div className="w-11/12 flex justify-end items-center h-16 my-2 md:m-0 m-auto lg:hidden">
              <button
                className="flex bg-blue-200 hover:bg-blue-300 items-center py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out cursor-pointer"
                onClick={() => props.history.goBack()}
              >
                <div className="ml-2 text-blue-700 text-md">Go Back</div>
              </button>
            </div>
            <div className="w-11/12 bg-white flex rounded py-6 md:py-12 shadow-lg border-b-4 border-blue-700 md:border-none mb-20 m-auto md:m-0">
              <div className="hidden md:block w-5/12 mb-6 border-r-2 border-gray-300 px-4">
                <img
                  src="/img/add-card-bg.svg"
                  alt=""
                  className="w-9/12 m-auto pt-32 pb-4 fade-in"
                />
              </div>
              <div className="md:w-7/12 w-full mb-6 md:px-12 px-6 md:py-6 py-3 relative">
                {/* Check if there are errors or messages in the state/API calls then dispkay them */}
                {errorMsg.length ? (
                  <div
                    className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md my-5"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="py-1">
                        <svg
                          className="fill-current h-6 w-6 text-red-500 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                      </div>
                      <div>
                        <ul style={{ listStyleType: "none" }}>
                          {errorMsg.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {incomingStateMessage && incomingStateMessage.length > 0 ? (
                  <div
                    className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md fade-in mb-5"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="py-1">
                        <svg
                          className="fill-current h-6 w-6 text-teal-500 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm">{incomingStateMessage}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                {defaultCardResponseMessage &&
                defaultCardResponseMessage?.length > 0 ? (
                  <div
                    className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md fade-in"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="py-1">
                        <svg
                          className="fill-current h-6 w-6 text-teal-500 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm">{defaultCardResponseMessage}</p>
                      </div>
                    </div>
                  </div>
                ) : removeCardResponseMessage &&
                  removeCardResponseMessage?.length > 0 ? (
                  <div
                    className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md fade-in"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="py-1">
                        <svg
                          className="fill-current h-6 w-6 text-teal-500 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm">{removeCardResponseMessage}</p>
                      </div>
                    </div>
                  </div>
                ) : responseMessage && responseData?.length > 0 ? (
                  <div
                    className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md fade-in"
                    role="alert"
                  >
                    <div className="flex">
                      <div className="py-1">
                        <svg
                          className="fill-current h-6 w-6 text-teal-500 mr-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm">{responseMessage}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <>
                  <div className="flex justify-end items-center h-16 my-2 md:my-6">
                    <button
                      className="flex bg-blue-200 hover:bg-blue-300 items-center py-2 px-4 rounded-lg transition-colors duration-150 ease-in-out cursor-pointer"
                      onClick={goToAddCard}
                    >
                      <div>
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="add_24px">
                            <path
                              id="icon/content/add_24px"
                              d="M19 13.3832H13V19.229H11V13.3832H5V11.4346H11V5.58878H13V11.4346H19V13.3832Z"
                              fill="#0A54A2"
                            />
                          </g>
                        </svg>
                      </div>
                      <div className="ml-2 text-blue-700 text-md">Add Card</div>
                    </button>
                  </div>
                  {/*If a card is being deleted, show deletion modal else display available cards them */}
                  {wantToDeleteCard ? (
                    <div className="flex items-center justify-center w-9/12 m-auto fade-in">
                      <div className="bg-white rounded-lg w-1/2">
                        <div className="flex flex-col items-start p-4">
                          <div className="flex items-center w-full">
                            <div className="text-gray-900 font-medium text-lg">
                              Confirm delete
                            </div>
                            <svg
                              className="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 18 18"
                            >
                              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                            </svg>
                          </div>
                          <hr />
                          <div>
                            Are you sure you want to delete the card ending with{" "}
                            <span className="font-semibold">
                              {selectedCard?.last4}
                            </span>
                            ?
                          </div>
                          <hr />
                          <div className="ml-auto">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
                              onClick={() => deleteCard(selectedCard?.id)}
                            >
                              Confirm
                            </button>
                            <button className="bg-transparent hover:bg-gray-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded duration-150 ease-in-out" onClick={() => setWantToDeleteCard(false)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {responseData?.length > 0 ? (
                        <h1 className="block text-blue-800 text-lg font-bold mb-6 fade-in">
                          Your available cards:
                        </h1>
                      ) : null}
                      {responseData?.length > 0 ? (
                        responseData &&
                        responseData.map((card, key) => (
                          <div className="" key={key}>
                            <div className="w-full flex">
                              <div
                                className={
                                  card.default
                                    ? "w-full m-auto"
                                    : "w-10/12 m-auto"
                                }
                              >
                                <div
                                  className={
                                    card.default
                                      ? "flex justify-between items-center h-16 p-4 my-5 rounded-lg shadow-xl default-card"
                                      : "flex justify-between items-center h-16 p-4 my-5  rounded-lg border border-blue-300 shadow-xl"
                                  }
                                >
                                  <div>
                                    <img
                                      className="h-6 md:h-8 w-6 md:w-8"
                                      src={cardIcon(card.card_type.trim())}
                                      alt="icon"
                                    />
                                  </div>
                                  <div
                                    className={
                                      card.default
                                        ? "text-xs md:text-base font-normal text-gray-300"
                                        : "text-xs md:text-base font-normal text-blue-600"
                                    }
                                  >
                                    XXXX - {card.last4}
                                  </div>
                                  {card.default ? (
                                    <div className="text-xs px-2 font-light rounded text-gray-400 bg-gray-800">
                                      <span className="default-card-label">
                                        Default
                                      </span>
                                    </div>
                                  ) : null}
                                  <div
                                    className={
                                      card.default
                                        ? "text-xs md:text-base font-normal text-gray-300"
                                        : "text-xs md:text-base font-normal text-blue-600"
                                    }
                                  >
                                    {card.exp_month}/{card.exp_year.slice(-2)}
                                  </div>
                                </div>
                              </div>
                              {/* If card is not default, show option dropdown for delete and setting default card */}
                              {!card.default ? (
                                <div className="w-2/12">
                                  <div className="group inline-block h-16 p-4 my-5 rounded-lg">
                                    <button className="outline-none focus:outline-none border rounded-lg px-3 py-2 bg-white flex items-center shadow-xl">
                                      <span>
                                        <svg
                                          className="fill-current h-4 w-4 transform group-hover:-rotate-180
                                                transition duration-150 ease-in-out"
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                      </span>
                                    </button>
                                    <ul
                                      className="bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute 
                                            transition duration-150 ease-in-out origin-top dropdown-wrap"
                                    >
                                      <li
                                        className="rounded-sm px-3 py-1 hover:bg-gray-200 cursor-pointer"
                                        onClick={() =>
                                          makeDefaultCard(card?.id)
                                        }
                                      >
                                        Make Default
                                      </li>
                                      <li
                                        className="rounded-sm px-3 py-1 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => _handleDeleteCard(card)}
                                      >
                                        Delete
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          {/* If there are no cards on file, notify user */}
                          <div className="w-full m-auto mb-6">
                            <img
                              src="/img/check-files.svg"
                              alt=""
                              className="w-3/4 md:w-2/4 m-auto opacity-50"
                            />
                          </div>
                          <div className="w-3/4 m-auto">
                            <p className="text-gray-700 font-medium text-center">
                              Looks like you have no card on file. Please click
                              on the add card button to add a new card.
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              </div>
            </div>
            <div className="w-11/12 mt-8 hidden md:block">
              <hr className="w-9/12 border-t-2 border-blue-600 bg-blue-400 rounded m-auto"></hr>
            </div>
          </div>
        </div>
        <br />
      </main>
    </>
  );
};

export default withRouter(MyCards);
