import * as React from "react"
import { toast as sonnerToast } from "sonner"

const TOAST_LIMIT = 20
const TOAST_REMOVE_DELAY = 1000

type ToasterToast = {
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_VALUE
    return count.toString()
}

type ActionType = typeof actionTypes

type Action =
    | {
        type: ActionType["ADD_TOAST"]
        toast: ToasterToast
    }
    | {
        type: ActionType["UPDATE_TOAST"]
        toast: Partial<ToasterToast>
        id: string
    }
    | {
        type: ActionType["DISMISS_TOAST"]
        id: string
    }
    | {
        type: ActionType["REMOVE_TOAST"]
        id: string
    }

interface State {
    toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
    if (toastTimeouts.has(toastId)) {
        return
    }

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId)
        dispatch({
            type: actionTypes.REMOVE_TOAST,
            id: toastId,
        })
    }, TOAST_REMOVE_DELAY)

    toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            }

        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.id ? { ...t, ...action.toast } : t
                ),
            }

        case actionTypes.DISMISS_TOAST: {
            const { id } = action

            addToRemoveQueue(id)

            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === id
                        ? {
                            ...t,
                        }
                        : t
                ),
            }
        }

        case actionTypes.REMOVE_TOAST:
            if (action.id === "all") {
                return {
                    ...state,
                    toasts: [],
                }
            }
            return {
                ...state,
                toasts: state.toasts.filter((t) => t.id !== action.id),
            }
    }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
    memoryState = reducer(memoryState, action)
    listeners.forEach((listener) => {
        listener(memoryState)
    })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
    const id = genId()

    // Also trigger sonner toast for modern appearance
    sonnerToast(props.title, {
        description: props.description,
        action: props.action,
    })

    const update = (props: ToasterToast) =>
        dispatch({
            type: actionTypes.UPDATE_TOAST,
            id,
            toast: props,
        })

    const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, id })

    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            title: props.title,
            description: props.description,
            action: props.action,
        },
    })

    return {
        id,
        dismiss,
        update,
    }
}

// Create variations of toast for different states
toast.success = (message: string, options = {}) => sonnerToast.success(message, options);
toast.error = (message: string, options = {}) => sonnerToast.error(message, options);
toast.warning = (message: string, options = {}) => sonnerToast.warning(message, options);
toast.info = (message: string, options = {}) => sonnerToast.info(message, options);

export { toast }  // Add explicit export for the toast function

export function useToast() {
    const [state, setState] = React.useState<State>(memoryState)

    React.useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    return {
        toast,
        toasts: state.toasts,
    }
}
