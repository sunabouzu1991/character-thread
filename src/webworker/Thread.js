import _classList from "./ClassList";

//список для хранения классов
const _Classes = new Map();


self.onmessage = (msg) => {
    //Создаём новый класс
    if ( msg.data.action === "CreateClass" ) {//className, params
        const className = msg.data.className;
        const params = msg.data.params;
        const _class = new _classList[className](params);
        const uuid = msg.data.uuid;

        _Classes.set(uuid, _class);
    }

    //удаляем класс
    if ( msg.data.action === "RemoveClass" ) {//uuid
        const uuid = msg.data.uuid;
        const _class = _Classes.get(uuid);
        if (_class.clear !== undefined) _class.clear();

        _Classes.delete(uuid);
    }

    //запрашиваем действие у класса
    if ( msg.data.action === "classMethod" ) {//uuid
        const uuid = msg.data.uuid;
        const method = msg.data.method;
        const params = msg.data.params;
        const _class = _Classes.get(uuid);
        const result = _class[method](params);

        if (result !== undefined) postMessage({uuid, action: 'classMethod', result});
    }
}