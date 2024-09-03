import {
  INIT_DATA_USER_DEFAULT,
  INIT_DATA_USER_MEMBER,
  SET_DATA_DEFAULT_USER,
  SET_DATA_MEMBER_USER,
} from "./SelectLayout.action"

export const initialState = {
  default: {
    imgType: "compact",
    imgDefault: "/template-before.png",
    imgSelect: "",
    inputNumber: 2,
    dimension: {
      width: 0,
      height: 0,
    },
    areas: {
      areas: [
        {
          bounds: {
            x: 0,
            y: 0,
            width: 1200 / 2,
            height: 405,
          },
        },
        {
          bounds: {
            x: 1200 / 2,
            y: 0,
            width: 1200 / 2,
            height: 405,
          },
        },
      ],
    },
  },
  member: {
    imgType: "large",
    imgDefault: "/template-after.png",
    imgSelect: "",
    inputNumber: 5,
    dimension: {
      width: 0,
      height: 0,
    },
    areas: {
      areas: [
        {
          bounds: {
            x: 0,
            y: 0,
            width: 400,
            height: 810,
          },
        },
        {
          bounds: {
            x: 400,
            y: 0,
            width: 400,
            height: 405,
          },
        },
        {
          bounds: {
            x: 400 * 2,
            y: 0,
            width: 400,
            height: 405,
          },
        },
        {
          bounds: {
            x: 400,
            y: 405,
            width: 400,
            height: 405,
          },
        },
        {
          bounds: {
            x: 400 * 2,
            y: 405,
            width: 405,
            height: 405,
          },
        },
      ],
    },
  },
}

export const selectLayoutReducer = (state, { payload, type }) => {
  switch (type) {
    case SET_DATA_DEFAULT_USER:
      return {
        ...state,
        default: payload,
      }
    case SET_DATA_MEMBER_USER:
      return {
        ...state,
        member: payload,
      }
    case INIT_DATA_USER_DEFAULT:
      return {
        ...state,
        default: initialState.default,
      }
    case INIT_DATA_USER_MEMBER:
      return {
        ...state,
        member: initialState.member,
      }
    default:
      return { ...initialState }
  }
}
