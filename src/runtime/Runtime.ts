import {AttributeValue} from "../types/attribute";
import Store from "./Store";

export default class Runtime {

	private internal = new Store<any>({
		path: '',
		colsId: 0,
		imgId: 0,
		classes: {},
		identStyles: {}
	});

	private globalVariables = new Store<AttributeValue>({
		preview: '',
		edge: 35,
		hgap: 10,
		vgap: 10,
		bgcolor: '#ffffff',
		width: 650
	});

	private localVariables = new Store<AttributeValue>({});

	/**
	 * @param name
	 * @param value
	 */
	public setLocalVariable(name: string, value: AttributeValue) {
		return this.localVariables.set(name, value);
	}

	/**
	 * @param name
	 */
	public getLocalVariable(name: string): AttributeValue {
		return this.localVariables.get(name);
	}

	/**
	 *
	 */
	public getLocalVariables(): Store<AttributeValue> {
		return this.localVariables;
	}

	/**
	 *
	 */
	public flushLocalVariables() {
		this.localVariables.clear();
	}

	/**
	 * @param name
	 * @param value
	 */
	public setVariable(name: string, value: AttributeValue) {
		return this.globalVariables.set(name, value);
	}

	public getVariable(name: string): AttributeValue {
		return this.globalVariables.get(name);
	}

	public getVariables(): Store<AttributeValue> {
		return this.globalVariables;
	}

	public setInternalMemoryItem(name: string, value: any): any {
		return this.internal.set(name, value);
	}

	public getInternalMemoryItem(name: string): any {
		return this.internal.get(name);
	}

	public getInternalMemory(): Store<any> {
		return this.internal;
	}

	public clone(): Runtime {
		const runtime = new Runtime();
		runtime.import(this);
		return runtime;
	}

	public import(runtime: Runtime) {
		this.internal.extend(runtime.getInternalMemory().getAll());
		this.globalVariables.extend(runtime.getVariables().getAll());
		this.localVariables.extend(runtime.getLocalVariables().getAll());
	}
}