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

	private variables = new Store<AttributeValue>({
		preview: '',
		edge: 35,
		hgap: 10,
		vgap: 10,
		bgcolor: '#ffffff',
		width: 650
	});

	public setVariable(name: string, value: AttributeValue) {
		return this.variables.set(name, value);
	}

	public getVariable(name: string): AttributeValue {
		return this.variables.get(name);
	}

	public getVariables(): Store<AttributeValue> {
		return this.variables;
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
		this.variables.extend(runtime.getVariables().getAll());
	}
}