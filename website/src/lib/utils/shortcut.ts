import { listen } from 'svelte/internal';

interface ActionReturn<Parameter> {
	update?: (parameter: Parameter) => void;
	destroy?: () => void;
}

interface Action<Parameter = void, Return = ActionReturn<Parameter>> {
	<Node extends HTMLElement>(node: Node, parameter: Parameter): Return;
}

export type ShortcutConfig = {
	/**
	 * The code of the key to listen for.
	 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code KeyboardEvent.code}
	 */
	code: KeyboardEventInit['code'];

	/**
	 * The callback to be called when the shortcut is triggered.
	 */
	callback?: (node: HTMLElement) => void;

	control?: boolean;
	shift?: boolean;
	alt?: boolean;
};

function default_callback(node: HTMLElement) {
	node.click();
}
/**
 * Simplest possible way to add a keyboard shortcut to an element.
 * It either calls a callback or clicks on the node it was put on.
 *
 * @example
 * ```svelte
 * <div use:shortcut={{ code: 'KeyA', callback: () => alert('A') }}>
 * ```
 */
export const shortcut: Action<ShortcutConfig> = (node, config) => {
	function handler(event: KeyboardEvent) {
		if (
			event.code == config.code &&
			event.altKey == !!config.alt &&
			event.shiftKey == !!config.shift &&
			(event.ctrlKey || event.metaKey) == !!config.control
		) {
			event.preventDefault();
			(config.callback || default_callback)(node);
		}
	}

	return {
		update(params) {
			config = params;
		},
		destroy: listen(window, 'keydown', handler as EventListener), // returns removeEventListener
	};
};
