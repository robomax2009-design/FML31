function Create(expression, subex = true) {
    if (expression == "1") {
        var myDiv = document.getElementById("output");
        myDiv.innerHTML = "<h3>Выражение 1 является тождественно истинным (тавтологией)</h3>";
        return;
    }
    if (expression == "0") {
        var myDiv = document.getElementById("output");
        myDiv.innerHTML = "<h3>Выражение 0 является тождественно ложным</h3>";
        return;
    }
    if (expression == "") {
        var myDiv = document.getElementById("output");
        myDiv.innerHTML = "";
        return;
    }

    let idCounter = 0;
    let dict = {};
    let cache = new Map();
    let variables = new Set();
    let word = "";
    let sep = "&|!>=();";
    
    for (let i = 0; i < expression.length; i++) {
        if (sep.includes(expression[i])) {
            if (word != "" & word != "0" & word != "1") {
                variables.add(word);
                word = "";
            }
            word = "";
        } else {
            word += expression[i];
        }
    }
    if (word != "" & word != "0" & word != "1") {
        variables.add(word);
        word = "";
    }
    if (variables.size == 0) {
        variables.add("Переменных нет");
    }

    function parse(expr) {
        expr = expr.trim();
        if (/^[a-z][a-z0-9]*$/i.test(expr)) {
            if (cache.has(expr)) return cache.get(expr);

            let id = `id${idCounter++}`;
            dict[id] = { expr, ids: [] };
            cache.set(expr, id);
            return id;
        }
        if (/^[01]$/.test(expr)) {
            if (cache.has(expr)) return cache.get(expr);
            let id = `C${idCounter++}`;
            dict[id] = { expr: expr, ids: [] };
            cache.set(expr, id);
            return id;
        }
        if (expr.startsWith('!')) {
            let inner = expr.slice(1);
            let depth = 0;
            let splitIndex = 0;
            if (inner[0] === '(') {
                for (let i = 0; i < inner.length; i++) {
                    if (inner[i] === '(') depth++;
                    else if (inner[i] === ')') depth--;
                    if (depth === 0) {
                        splitIndex = i + 1;
                        break;
                    }
                }
            } else {
                let m = /^[a-z][a-z0-9]*|[01]/i.exec(inner);
                if (m) splitIndex = m[0].length;
            }

            let firstPart = inner.slice(0, splitIndex);
            let rest = inner.slice(splitIndex);

            let innerId = "";
            if (variables.has(firstPart.trim())) {
                innerId = firstPart;
            } else {
                innerId = parse(firstPart);
            }

            let key = `!${innerId}`;
            if (!cache.has(key)) {
                let id = `T${idCounter++}`;
                dict[id] = { expr: '!?', ids: [innerId] };
                cache.set(key, id);
            }
            let notId = cache.get(key);
            if (rest) {
                return parse(`(${notId})${rest}`);
            }
            return notId;
        }
        if (expr.startsWith('(') && expr.endsWith(')')) {
            let depth = 0;
            let matched = true;
            for (let i = 0; i < expr.length; i++) {
                if (expr[i] === '(') depth++;
                else if (expr[i] === ')') depth--;
                if (depth === 0 && i < expr.length - 1) {
                    matched = false;
                    break;
                }
            }
            if (matched) return parse(expr.slice(1, -1));
        }
        let operators = ['>>', '=', '|', '&'];
        for (let op of operators) {
            let depth = 0;
            for (let i = expr.length - 1; i >= 0; i--) {
                if (expr[i] === ')') depth++;
                else if (expr[i] === '(') depth--;
                else if (depth === 0 && expr.slice(i - op.length + 1, i + 1) === op) {
                    let left = expr.slice(0, i - op.length + 1);
                    let right = expr.slice(i + 1);
                    let leftId = parse(left);
                    let rightId = parse(right);

                    let key = `${leftId}${op}${rightId}`;
                    if (cache.has(key)) return cache.get(key);

                    let id = `T${idCounter++}`;
                    dict[id] = { expr: `?${op}?`, ids: [leftId, rightId] };
                    cache.set(key, id);
                    return id;
                }
            }
        }

        throw new Error();
    }

    let final = new Set();
    let expressionsList = expression.split(";").filter(e => e != "");
    let originalExpressions = [];
    
    expressionsList.forEach(element => {
        const parsedId = parse(element);
        final.add(parsedId);
        originalExpressions.push({
            expr: element,
            id: parsedId
        });
    });

    let finalDict = {};
    for (let [id, obj] of Object.entries(dict)) {
        if (/^[01]$/.test(obj.expr)) {
            finalDict[id] = obj;
        } else if (obj.ids.length === 0) {
            for (let ref of Object.values(dict)) {
                for (let i = 0; i < ref.ids.length; i++) {
                    if (ref.ids[i] === id) {
                        ref.ids[i] = `${obj.expr}`;
                    }
                }
            }
        } else {
            finalDict[id] = obj;
        }
    }

    function needcolumn(id) {
        return subex | final.has(id);
    }

    var myDiv = document.getElementById("output");
    let text = "<table class=\"tabl\">";

    text += "<tr>";
    variables.forEach(element => {
        if (element !== "Переменных нет") {
            text += `<td class=\"item ex\">${element}</td>`;
        }
    });

    function visual(id) {
        if (!(id in finalDict)) {
            return id;
        }
        let i = 0;
        const result = finalDict[id].expr.replace(/\?/g, () => {
            const replacement = visual(finalDict[id].ids[i]) || '';
            i++;
            return replacement;
        });
        return `(${result})`;
    }

    // Отдельно собираем ВСЕ формулы для таблицы (включая промежуточные)
    let allFormulaExpressions = [];
    for (let id in finalDict) {
        if (!needcolumn(id)) continue;
        if (/^[01]$/.test(finalDict[id].expr)) continue;
        const st = visual(id);
        const exprText = st.substring(1, st.length - 1);
        allFormulaExpressions.push({ 
            id, 
            expr: exprText,
            isFinal: final.has(id) // Помечаем конечные формулы
        });
        text += `<td class=\"item ex\">${exprText}</td>`;
    }
    text += "</tr>";

    // Отдельно сохраняем конечные формулы для СДНФ/СКНФ
    let finalFormulaExpressions = allFormulaExpressions.filter(f => f.isFinal);

    function generateList(n) {
        const total = Math.pow(2, n);
        const result = [];

        for (let i = 0; i < total; i++) {
            const binaryStr = i.toString(2).padStart(n, '0');
            const binaryArr = Array.from(binaryStr).map(bit => Number(bit));
            result.push(binaryArr);
        }

        return result;
    }

    const astCache = Object.create(null);

    function tokenize(expr) {
        const cleaned = expr.replace(/\s+/g, "");
        const re = />>|[01]|[A-Za-z_][A-Za-z0-9_]*|\?|\(|\)|&|\||!|=/g;
        const tokens = [];
        let m;
        while ((m = re.exec(cleaned)) !== null) tokens.push(m[0]);
        return tokens;
    }

    function parseTokens(tokens) {
        let pos = 0;
        const peek = () => tokens[pos];
        const consume = (t) => {
            if (t !== undefined && tokens[pos] !== t) throw new Error(`Expected '${t}', got '${tokens[pos]}'`);
            return tokens[pos++];
        };

        function parseExpr() { return parseEquiv(); }

        function parseEquiv() {
            let node = parseImpl();
            while (peek() === "=") {
                consume("=");
                node = { type: "=", left: node, right: parseImpl() };
            }
            return node;
        }

        function parseImpl() {
            let node = parseOr();
            while (peek() === ">>") {
                consume(">>");
                node = { type: ">>", left: node, right: parseOr() };
            }
            return node;
        }

        function parseOr() {
            let node = parseAnd();
            while (peek() === "|") {
                consume("|");
                node = { type: "|", left: node, right: parseAnd() };
            }
            return node;
        }

        function parseAnd() {
            let node = parseUnary();
            while (peek() === "&") {
                consume("&");
                node = { type: "&", left: node, right: parseUnary() };
            }
            return node;
        }

        function parseUnary() {
            if (peek() === "!") {
                consume("!");
                return { type: "!", value: parseUnary() };
            }
            if (peek() === "(") {
                consume("(");
                const node = parseExpr();
                if (peek() !== ")") throw new Error("Expected ')'");
                consume(")");
                return node;
            }
            if (peek() === "?") {
                consume("?");
                return { type: "?" };
            }
            const t = peek();
            if (t && /^[A-Za-z_][A-Za-z0-9_]*$/.test(t)) {
                consume(t);
                return { type: "ident", name: t };
            }
            if (t === "0" || t === "1") {
                consume(t);
                return { type: "const", value: Number(t) };
            }
            throw new Error("Unexpected token: " + peek());
        }

        const node = parseExpr();
        if (pos < tokens.length) throw new Error("Extra tokens after parse: " + tokens.slice(pos).join(" "));
        return node;
    }

    function evalAst(node, placeholderValues, idxRef, evalExprFn, visited) {
        switch (node.type) {
            case "?":
                if (idxRef.i >= placeholderValues.length) throw new Error("Too few values for '?' placeholders");
                return placeholderValues[idxRef.i++];
            case "!":
                return !evalAst(node.value, placeholderValues, idxRef, evalExprFn, visited);
            case "&":
                return evalAst(node.left, placeholderValues, idxRef, evalExprFn, visited) &&
                    evalAst(node.right, placeholderValues, idxRef, evalExprFn, visited);
            case "|":
                return evalAst(node.left, placeholderValues, idxRef, evalExprFn, visited) ||
                    evalAst(node.right, placeholderValues, idxRef, evalExprFn, visited);
            case ">>": {
                const a = evalAst(node.left, placeholderValues, idxRef, evalExprFn, visited);
                const b = evalAst(node.right, placeholderValues, idxRef, evalExprFn, visited);
                return (!a) || b;
            }
            case "=": {
                const a = evalAst(node.left, placeholderValues, idxRef, evalExprFn, visited);
                const b = evalAst(node.right, placeholderValues, idxRef, evalExprFn, visited);
                return a === b;
            }
            case "const":
                return node.value;
            case "ident":
                if (node.name in cur) return cur[node.name];
                return evalExprFn(node.name, visited);
            default:
                throw new Error("Unknown AST node type: " + node.type);
        }
    }

    function evalExpr(id, visited = new Set()) {
        if (id in cur) return cur[id];
        if (!(id in dict)) throw new Error(`Unknown id: ${id}`);
        if (visited.has(id)) throw new Error(`Cyclic reference detected at '${id}'`);
        visited.add(id);
        const entry = dict[id];
        const expr = entry.expr;
        const ids = entry.ids || [];
        const placeholderValues = ids.map(x => evalExpr(x, visited));
        let ast = astCache[id];
        if (!ast) {
            const tokens = tokenize(expr);
            ast = parseTokens(tokens);
            astCache[id] = ast;
        }
        const result = evalAst(ast, placeholderValues, { i: 0 }, evalExpr, visited);
        visited.delete(id);
        return result;
    }

    let cur = {};
    let list = generateList(variables.size);
    let allResults = [];
    let varArray = Array.from(variables).filter(v => v !== "Переменных нет");
    
    list.forEach(element => {
        text += "<tr>";
        cur = {};
        let i = 0;
        let varValues = {};
        variables.forEach(e => {
            if (e !== "Переменных нет") {
                cur[e] = element[i];
                varValues[e] = element[i];
                text += `<td class="item log">${element[i]}</td>`;
                i++;
            }
        });

        let rowResults = {};
        allFormulaExpressions.forEach(formula => {
            let result = evalExpr(formula.id);
            rowResults[formula.id] = result;
            if (result) {
                text += `<td class=\"item log\">1</td>`;
            } else {
                text += `<td class=\"item log\">0</td>`;
            }
        });
        allResults.push({ varValues, rowResults });
        text += "</tr>";
    });
    text += "</table>";

    if (finalFormulaExpressions.length > 0) {
        text += "<div class=\"formulas_container\">";
        
        finalFormulaExpressions.forEach(formula => {
            let formulaResultsList = [];
            allResults.forEach(row => {
                formulaResultsList.push(row.rowResults[formula.id]);
            });
            
            let sdnfTerms = [];
            allResults.forEach((row, index) => {
                if (formulaResultsList[index]) {
                    let termParts = [];
                    varArray.forEach(varName => {
                        if (row.varValues[varName] === 1) {
                            termParts.push(varName);
                        } else {
                            termParts.push(`¬${varName}`);
                        }
                    });
                    sdnfTerms.push(termParts.join(''));
                }
            });
            
            let sknfTerms = [];
            allResults.forEach((row, index) => {
                if (!formulaResultsList[index]) {
                    let termParts = [];
                    varArray.forEach(varName => {
                        if (row.varValues[varName] === 0) {
                            termParts.push(varName);
                        } else {
                            termParts.push(`¬${varName}`);
                        }
                    });
                    sknfTerms.push(`(${termParts.join('+')})`);
                }
            });
            
            let sdnfText = "";
            if (sdnfTerms.length === 0) {
                sdnfText = "0";
            } else if (sdnfTerms.length === Math.pow(2, varArray.length)) {
                sdnfText = "1";
            } else {
                sdnfText = sdnfTerms.join('+');
            }
            let sknfText = "";
            if (sknfTerms.length === 0) {
                sknfText = "1";
            } else if (sknfTerms.length === Math.pow(2, varArray.length)) {
                sknfText = "0";
            } else {
                sknfText = sknfTerms.join('');
            }
            
            text += `<ul class="formulas_space">`;
            text += `<strong>${formula.expr}</strong>`;
            text += `<li><strong>СДНФ:</strong> ${sdnfText}</li>`;
            text += `<li><strong>СКНФ:</strong> ${sknfText}</li>`;
            text += `</ul>`;
        });
        
        text += "</div>";

        if (finalFormulaExpressions.length > 0) {
            const firstFormulaId = finalFormulaExpressions[0].id;
            let isTautology = true;
            let isContradiction = true;
            
            allResults.forEach(row => {
                if (!row.rowResults[firstFormulaId]) isTautology = false;
                if (row.rowResults[firstFormulaId]) isContradiction = false;
            });
            
            if (isTautology) {
                text += "<h3>Выражение является тождественно истинным (тавтологией)</h3>";
            }
            if (isContradiction) {
                text += "<h3>Выражение является тождественно ложным</h3>";
            }
        }
    }

    myDiv.innerHTML = text;

    const elements = document.querySelectorAll('.log');
    function color(i) {
        if (i >= elements.length) {
            return;
        }
        const content = elements[i].textContent.trim();
        if (content === '1') {
            elements[i].classList.add('correct');
        } else if (content === '0') {
            elements[i].classList.add('incorrect');
        }
        setTimeout(() => { color(i + 1) }, 10);
    }
    setTimeout(() => { color(0) }, 10);

    const newel = document.querySelectorAll('.ex');
    function color2(i) {
        if (i >= newel.length) {
            return;
        }
        newel[i].classList.add('exp');
        setTimeout(() => { color2(i + 1) }, 40);
    }
    setTimeout(() => { color2(0) }, 10);
}

function count(str, char) {
  return str.split(char).length - 1;
}

function processInput() {
    let expr = document.querySelector('input[name="expression"]').value;
    expr = expr.replace(/ /g, "");
    expr = expr.replace(/<->/g, "=");
    expr = expr.replace(/->/g, ">>");
    expr = expr.replace(/-/g, "!");
    expr = expr.replace(/\*/g, "&");
    expr = expr.replace(/\+/g, "|");

    expr = expr.replace(/<=>/g, "=");
    expr = expr.replace(/=>/g, ">>");
    expr = expr.replace(/¬/g, "!");
    expr = expr.replace(/∧/g, "&");
    expr = expr.replace(/v/g, "|");
 
    expr = expr.replace(/^(>>|=|\||&)+/, '');
    expr = expr.replace(/(>>|=|!|\||&)+$/, '')

    const openCount = count(expr, '(');
    const closeCount = count(expr, ')');
    if (openCount > closeCount) expr += ')'.repeat(openCount - closeCount);
    if (closeCount > openCount) expr = '('.repeat(closeCount - openCount) + expr;

    const checkbox = document.getElementById('subexpression');
    console.log(expr);
    try {
        Create(expr, checkbox.checked);
    } catch {
        var myDiv = document.getElementById("output");
        myDiv.innerHTML = "<h3>Ошибка в формуле!</h3>";
    }
}

function copyCode() {
  const codeElement = document.getElementById('code');
  const text = codeElement.innerText || codeElement.textContent;
  navigator.clipboard.writeText(text);
}