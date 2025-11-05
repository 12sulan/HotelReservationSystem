import { useReducer, createContext } from "react";

const INITIAL_STATE = {
    city: "",
    
    dates: [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ],
    options: {
        adult: 1,
        children: 0,
        room: 1,
    },
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
    switch (action.type) {
        case "NEW_SEARCH":
            // Merge payload with defaults so fields are always present and well-shaped
            return {
                city: action.payload.city ?? state.city ?? INITIAL_STATE.city,
                dates:
                    action.payload.dates && action.payload.dates.length > 0
                        ? action.payload.dates
                        : state.dates ?? INITIAL_STATE.dates,
                options: {
                    adult:
                        action.payload.options?.adult ?? state.options.adult ?? INITIAL_STATE.options.adult,
                    children:
                        action.payload.options?.children ?? state.options.children ?? INITIAL_STATE.options.children,
                    room:
                        action.payload.options?.room ?? state.options.room ?? INITIAL_STATE.options.room,
                },
            };
        case "RESET_SEARCH":
            return INITIAL_STATE;
        default:
            return state;
    }
};

export const SearchContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);
    return (
        <SearchContext.Provider
            value={{
                city: state.city,
                dates: state.dates,
                options: state.options,
                dispatch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};
