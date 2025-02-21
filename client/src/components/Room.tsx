import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ERoomStatus,
  ERoomEvents,
  IResult,
  IValues,
  EUserRole,
} from "../common/models";
import { EAction, IRoom, IUser, IUpCatArgs } from "../common/models";
import { Context } from "../global/Context";
import { Categories } from "./Categories";
import { RoomActions } from "./RoomActions";
import { Users } from "./Users";
import { onMessase } from "../common/sockets";
import { triggedDomEvent, getEndpoint } from "../common/utils";
import { Stats } from "./Stats";
import "./Room.css";
import { Alert, CenteredCard } from "../common";
import { MostRecent } from "./MostRecent";

export const Room = () => {
  const ENDPOINT = getEndpoint() || "localhost:3333";
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    status,
    send,
    service,
    socket,
    currentUser,
    currentCategoryId,
    currentSession,
    set__currentUser,
    roomState,
    set__currentSession,
    set__currentCategoryId,
  } = useContext(Context);

  const [userName, set__userName] = useState("");
  const [roomData, set__roomData] = useState<IRoom | undefined>();
  const [roomId, set__roomId] = useState("");
  const [roomName, set__roomName] = useState("");
  const [capacity, set__capacity] = useState<{
    max: boolean;
    error: string | null;
  }>({
    max: false,
    error: null,
  });
  const [users, set__Users] = useState<IUser[]>([]);

  // Monitor statuses
  useEffect(() => {
    if (!service) return;

    const subscription = service.subscribe((state) => {
      if (state.changed) {
        // console.log(state.value);
        // console.log("context = ", state.context);
      }
    });
    return () => subscription.unsubscribe();
  }, [service]);

  const { initial, editingCards, editingCategories, viewingStats } =
    ERoomStatus;
  const { EDIT_CARDS, EDIT_CATEGORIES, VIEW_STATS, DONE } = ERoomEvents;

  useEffect(() => {
    let roomIdParam: string | undefined = params.roomId;
    let _userName: string | undefined = roomState.userName;
    let _userRole: EUserRole | undefined = roomState.userRole;
    let _roomName = roomState.roomName || "unknown";

    if (roomIdParam && _userName && _userRole) {
      set__userName(_userName);
      set__roomId(roomIdParam);
      set__roomName(_roomName);

      if (!socket) {
        console.error("Socket not initialized");
        return;
      }

      socket.emit(
        "join",
        {
          userName: _userName,
          userRole: _userRole,
          roomId: roomIdParam,
          roomName: _roomName,
        },
        (res: { user?: IUser; error?: string; maxCapacity?: boolean }) => {
          if (res.maxCapacity)
            return set__capacity({
              max: true,
              error: res.error || "Room is at maximum capacity",
            });
          if (res.error) toast.error(res.error);
          if (res.user) set__currentUser(res.user);
        }
      );
    }

    return () => {
      if (socket) {
        socket.off("join");
      }
    };
  }, [location.pathname, params.roomId, socket]);

  useEffect(() => {
    if (!socket) return;

    onMessase(socket);

    socket.on("roomData", (result: { users: IUser[]; room: IRoom }) => {
      if (result.users) set__Users(result.users);

      if (result.room && result.room.currentSession && result.room.name) {
        set__currentSession(result.room.currentSession);
        set__roomData(result.room);
        set__roomName(result.room.name);

        // Once a voting session stops, force switch all to initial state
        if (result.room.currentSession.active) {
          send({ type: DONE });
        }

        // Once a voting session stops, force switch all to viewingStats state
        if (
          result.room.currentSession.active === false &&
          result.room.currentSession.session
        ) {
          send({ type: VIEW_STATS });
        }

        if (result.room.currentSession.activeCategoryId) {
          set__currentCategoryId(result.room.currentSession.activeCategoryId);
          // 👇dumb thing you need to do for materialize to focus on current category
          triggedDomEvent();
        }
      }
    });

    // When session is over, force end viewingStats state for all
    socket.on("sessionReset", () => send({ type: DONE }));

    return () => {
      socket.off("message");
      socket.off("roomData");
      socket.off("sessionReset");
    };
  }, [socket, send, set__currentSession, set__currentCategoryId]);

  const updateCategories = (
    action: EAction,
    categoryId?: string,
    values?: IValues
  ) => {
    if (!socket) return;

    if (roomId) {
      const args: IUpCatArgs = { roomId, action };
      if (action !== EAction.add && categoryId && values) {
        args.categoryId = categoryId;
        args.values = values;
      }
      socket.emit("updateCategories", args, (res: IResult) => {
        if (res.error) return toast.error(res.error);
        if (action === EAction.add && res.room?.categories) {
          const lastCat = res.room.categories[res.room.categories.length - 1];
          if (lastCat && !lastCat.name && !lastCat.singular) {
            set__currentCategoryId(lastCat.id);
          }
        }
      });
    }
  };

  const updateCategoryCards = (
    categoryId: string,
    unit: number,
    action: EAction
  ) => {
    if (!socket) return;

    if (roomId) {
      socket.emit(
        "updateCategoryCards",
        {
          roomId,
          categoryId,
          unit,
          action,
        },
        (res: IResult) => {
          if (res.error) toast.error(res.error);
        }
      );
    }
  };

  const categoriesTitle = () => {
    if (!roomData) return <h4>Loading...</h4>;

    if (currentSession.active && currentSession.activeCategoryId) {
      const currentCategory = roomData.categories.find(
        (c) => c.id === currentSession.activeCategoryId
      );
      return (
        <h4 className="active-category">
          Voting is currently in session for:{" "}
          {currentCategory?.name || "Unknown category"}
        </h4>
      );
    } else if (status.matches(editingCategories)) {
      return <h4>Categories</h4>;
    } else if (status.matches(viewingStats)) {
      return <h4>Voting Results</h4>;
    } else if (status.matches(editingCards)) {
      const foundCat = roomData.categories.find(
        (c) => c.id === currentCategoryId
      );
      return <h4>Edit cards for: {foundCat?.name || "Unknown category"}</h4>;
    } else {
      return <h4>Current Category</h4>;
    }
  };

  if (capacity.max)
    return (
      <CenteredCard>
        <Alert
          text={capacity.error || "Room is at maximum capacity"}
          type="warning"
        />
      </CenteredCard>
    );

  if (!currentUser || !roomData || !roomData.categories || !users) return null;

  return (
    <div className="Room container">
      <div className="room-grid-container">
        <section className="room-name">
          <h1>{roomName}</h1>
          {currentUser.role !== EUserRole.admin &&
          roomData.status === ERoomStatus.edit ? (
            <Alert
              type="warning"
              text="Categories are currently being edited by the admin. Please, wait until they are done being edited to do anything on the page."
            />
          ) : null}
        </section>
        <aside className="users-aside">
          <h4>Users</h4>
          <Users users={users} />
        </aside>

        <main>
          {categoriesTitle()}
          {currentSession.active === false &&
          currentSession.session &&
          status.matches(viewingStats) ? (
            <Stats roomData={roomData} />
          ) : (
            <Categories
              categories={roomData.categories}
              currentSession={roomData.currentSession}
              updateCategoryCards={updateCategoryCards}
              updateCategories={updateCategories}
            />
          )}
        </main>

        <aside className="issues-aside">
          <h4>Actions</h4>
          <RoomActions roomData={roomData} />
          {roomData.issues && roomData.issues.length ? (
            <>
              <h4>Most Recent</h4>
              <MostRecent roomData={roomData} />
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
};
