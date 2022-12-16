import styles from "./card.module.css";
import {
  FaEdit,
  FaTrashAlt,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { useMediaQuery } from "react-responsive";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import Cookies from "universal-cookie";
import { MyPageContext } from "../../context/PageContext";

// import {Link} from "react-router-dom";

const Card = (props) => {
  const isMobile = useMediaQuery({
    query: "(min-width: 320px) and (max-width: 819px)",
  });
  const isDesktop = useMediaQuery({ minWidth: 820 });
  const activity = ["Running", "Walking", "Swimming", "Hiking", "Cycling"];
  const status = ["pending", "Completed"];
  const startDate = new Date(props.startDate);
  const startDateString = startDate.toLocaleString();
  const endDate = new Date(props.endDate);
  /* const endDateString = endDate.toLocaleString() */
  const minuteDuration = (endDate - startDate) / (60 * 1000);
  const hourDuration = Math.floor(minuteDuration / 60);
  const minuteRemainingDuration = minuteDuration % 60;
  /* console.log(props.keys) */

  const { setIsChangeValue, data } = MyPageContext();

  const cookies = new Cookies();
  const handleOnClickDelete = async (e) => {
    e.preventDefault();
    const activitykey = e.target.getAttribute("keys");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            process.env.REACT_APP_BACKEND_ROUTE + "/activities/deleteActivity",
            {
              headers: {
                user: cookies.get("user"),
                refreshtoken: cookies.get("refreshToken"),
                activitykey: activitykey,
              },
            }
          )
          .then((response) => {
            console.log(response);
            if (response) {
              setIsChangeValue(true);
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
            }
          })
          .catch((e) => {
            if (e.response.status === 400) {
              Swal.fire({
                title: `Bad Request!`,
                text: `${e.response.data.msg}`,
                icon: "error",
                confirmButtonText: "OK",
              });
            } else if (e.response.status === 401) {
              Swal.fire({
                title: `Unauthorize!`,
                text: `${e.response.data.msg}`,
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          });
      }
    });
  };

  const handleOnClickEdit = async (e) => {
    e.preventDefault();
    const activitykey = e.target.getAttribute("keys");
    const editArrItem = data.filter((e) => {
      return e._id === activitykey;
    });

    console.log(editArrItem);
    const MySwal = withReactContent(Swal);
    try {
      const { value: result } = await MySwal.fire({
        title: "Edit Activity",
        html: (
          <div className="add-modal">
            <div className="modal-input-group">
              <label htmlFor="swal-input2">Activity-Name </label>
              <input
                id="swal-input1"
                className="swal2-input swal-add"
                placeholder="Activity-Name"
                defaultValue={editArrItem[0].name}
                required
              />
            </div>
            <div className="modal-input-group">
              <label htmlFor="swal-input2">Description </label>
              <textarea
                id="swal-input2"
                className="swal2-input swal-add"
                placeholder="Description"
                defaultValue={editArrItem[0].description}
                required
              ></textarea>
            </div>
            <div className="modal-input-group">
              <label htmlFor="swal-input3">Sport type </label>
              <select
                id="swal-input3"
                className="swal2-input swal-add"
                defaultValue={editArrItem[0].activityType}
                required
              >
                <option value={0}>Please select activity type</option>
                <option value={1}>Running</option>
                <option value={2}>Walking</option>
                <option value={3}>Swimming</option>
                <option value={4}>Hiking</option>
                <option value={5}>Cycling</option>
              </select>
            </div>
            <div className="modal-input-group">
              <label htmlFor="swal-input4">Start Date </label>
              <input
                id="swal-input4"
                type="datetime-local"
                className="swal2-input swal-add"
                defaultValue={`${editArrItem[0].startDate.slice(0, -2)}`}
                required
              />
            </div>
            <div className="modal-input-group">
              <label htmlFor="swal-input5">End Date </label>
              <input
                id="swal-input5"
                type="datetime-local"
                className="swal2-input swal-add"
                defaultValue={`${editArrItem[0].endDate.slice(0, -2)}`}
                required
              />
            </div>
          </div>
        ),
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
            document.getElementById("swal-input3").value,
            document.getElementById("swal-input4").value,
            document.getElementById("swal-input5").value,
          ];
        },
        showCancelButton: true,
      });
      if (result) {
        const response = await axios.put(
          process.env.REACT_APP_BACKEND_ROUTE + "/activities/editActivity",
          {
            user: cookies.get("user"),
            refreshToken: cookies.get("refreshToken"),
            activityId: activitykey,
            activity: {
              name: result[0],
              description: result[1],
              activityType: result[2],
              startDate: result[3],
              endDate: result[4],
            },
          }
        );
        if (response) {
          setIsChangeValue(true);
          Swal.fire({
            title: `${response.data.msg}!`,
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      }
    } catch (e) {
      if (e.response.status === 400) {
        Swal.fire({
          title: `Bad Request!`,
          text: `${e.response.data.msg}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (e.response.status === 401) {
        Swal.fire({
          title: `Unauthorize!`,
          text: `${e.response.data.msg}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const updateStatus = async (status,activitykey) => {
    try {
      let response = await axios.put(
        process.env.REACT_APP_BACKEND_ROUTE + "/activities/editStatus",
        {
          user: cookies.get("user"),
          refreshToken: cookies.get("refreshToken"),
          activityId: activitykey,
          statusChange: status,
          //userID, refreshToken, activityId, statusChange
        }
      );
      if (response) {
        //console.log(response);
        setIsChangeValue(true)
      }
    } catch (e) {
      if (e.response.status === 400) {
        Swal.fire({
          title: `Bad Request!`,
          text: `${e.response.data.msg}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (e.response.status === 401) {
        Swal.fire({
          title: `Unauthorize!`,
          text: `${e.response.data.msg}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }

  }

  const handleOnclickCheck = async (e) => {
    e.preventDefault();
    const activitykey = e.target.getAttribute("keys");
    updateStatus(1,activitykey)
  };

  const handleOnclickCross = async (e) => {
    e.preventDefault();
    const activitykey = e.target.getAttribute("keys");
    updateStatus(0,activitykey)
  };

  const mobileJSX = (
    <div className={styles["card_plate"]}>
      <form className={styles["card_data"]}>
        <div className={styles["card_head"]}>
          <h1>No.{props.number}</h1>
          <div className={styles["card_head_icon"]}>
            <FaEdit className={styles["edit"]} /> {/* onClick={toggleEdit} */}
            <FaTrashAlt
              className={styles["bin-mobile"]}
              keys={props.keys}
              onClick={handleOnClickDelete}
            />
          </div>
        </div>

        <div className={styles["card_name size"]}>
          <strong>Name : </strong>
          <span>{props.name}</span>
          <FaTrashAlt
            className={styles["bin"]}
            keys={props.keys}
            onClick={handleOnClickDelete}
          />{" "}
          {/* onClick={toggleBinDesk} */}
        </div>

        <div className={styles["card_activity size"]}>
          <strong>Activity : </strong>
          <span>{activity[props.activityType - 1]}</span>
        </div>

        <div className={styles["card_date size"]}>
          <strong>StartDate : </strong>
          <span>{startDateString}</span>
        </div>

        <div className={styles["card_date size"]}>
          <strong>Duration : </strong>
          <span>{hourDuration > 0 ? `${hourDuration} hr.` : ""}</span>
          <span>
            {" "}
            {minuteRemainingDuration > 0
              ? `${minuteRemainingDuration} min.`
              : ""}
          </span>
        </div>

        <div className={styles["card_status size"]}>
          <strong>Status : </strong>
          <span>{status[props.status]}</span>
          <div className={styles["card_status_btn"]}>
            {props.status === 1 && <FaTimesCircle
              className={styles["wrong"]}
              keys={props.keys}
              onClick={handleOnclickCross}
            />}
            { props.status === 0 && <FaCheckCircle
              className={styles["check"]}
              keys={props.keys}
              onClick={handleOnclickCheck}
            />}
          </div>
        </div>
      </form>
    </div>
  );

  const DestopJSX = (
    <div className={styles["card_plate"]}>
      <form className={styles["card_data"]}>
        <div className={styles["card_head"]}>
          <h1>No.{props.number}</h1>
          <div className={styles["card_head_icon"]}>
            <FaEdit
              className={styles["edit"]}
              keys={props.keys}
              onClick={handleOnClickEdit}
            />
          </div>
        </div>

        <div className={styles["card_name size"]}>
          <strong>Name : </strong>
          <span>{props.name}</span>
          <FaTrashAlt
            className={styles["bin"]}
            keys={props.keys}
            onClick={handleOnClickDelete}
          />
        </div>

        <div className={styles["card_datail size"]}>
          <strong>Description : </strong>
          <span>{props.description}</span>
        </div>

        <div className={styles["card_activity size"]}>
          <strong>Activity : </strong>
          <span>{activity[props.activityType - 1]}</span>
        </div>

        <div className={styles["card_date size"]}>
          <strong>StartDate : </strong>
          <span>{startDateString}</span>
        </div>

        <div className={styles["card_period size"]}>
          <strong>Duration : </strong>
          <span>{hourDuration > 0 ? `${hourDuration} hr.` : ""}</span>
          <span>
            {" "}
            {minuteRemainingDuration > 0
              ? `${minuteRemainingDuration} min.`
              : ""}
          </span>
        </div>

        <div className={styles["card_status size"]}>
          <strong>Status : </strong>
          <span>{status[props.status]}</span>
          <div className={styles["card_status_btn"]}>
          { props.status === 1 &&<FaTimesCircle
              className={styles["wrong"]}
              keys={props.keys}
              onClick={handleOnclickCross}
            />}
            { props.status === 0 &&<FaCheckCircle
              className={styles["check"]}
              keys={props.keys}
              onClick={handleOnclickCheck}
            />}
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {isMobile && mobileJSX}
      {isDesktop && DestopJSX}
    </>
  );
};

export default Card;
