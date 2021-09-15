function solve(g) {
	const input = g;
	const getVs = ([i, j]) => {
		// 获取四方向未访问的结点
		const vs = [];
		for (let k = 0, di = 0, dj = 1; k < 4; ++k, [di, dj] = [dj, -di]) {
			const [_i, _j] = [i + di, j + dj];
			if (g[_i] && g[_i][_j]) {
				vs.push([_i, _j]);
			}
		}
		return vs;
	};

	let s = []; // 起点列表
	let n = 0; // 结点数
	let deg1 = 0; // 度为1的结点数
	let flag = false; // 是否已找到一个连通分量

	g = input.map(row => [...row]);

	// 深搜，进行初步判定
	for (let i = 0; i < g.length; ++i) {
		for (let j = 0; j < g[0].length; ++j) {
			if (!g[i][j]) continue;
			if (flag) return { input, failed: '存在多个连通分量' };
			flag = true;
			const dfs = ([i, j]) => {
				if (!g[i][j]) return;
				if (g[i][j] == 2) {
					s.push([i, j]);
				}
				g[i][j] = 0;
				++n;
				for (let v of getVs([i, j])) {
					dfs(v);
				}
			};
			dfs([i, j]);
		}
	}
	if (!flag) return { input, failed: '输入为空' };
	if (n == 1 && s.length == 1) return { input, output: s };

	g = input.map(row => [...row]);

	if (n == 1) {
		for (let i = 0; i < g.length; ++i) {
			for (let j = 0; j < g[0].length; ++j) {
				if (g[i][j]) return {
					input,
					output: [
						[i, j]
					]
				};
			}
		}
	}

	// 统计度为1的结点数
	for (let i = 0; i < g.length; ++i) {
		for (let j = 0; j < g[0].length; ++j) {
			if (!g[i][j]) continue;
			if (getVs([i, j]).length == 1) {
				++deg1;
			}
		}
	}

	// 深搜+剪枝，寻找哈密顿通路
	const dfs = ([i, j], vs, n, deg1, path) => {
		g[i][j] = 0;
		path.push([i, j]);
		--n;
		if (vs.length == 1) --deg1;
		const vvs = vs.map(v => getVs(v));
		let deg1V = [];
		for (let k = 0; k < vs.length; ++k) {
			if (vvs[k].length == 0) {
				if (--n == 0) {
					path.push(vs[k]);
					return path;
				} else {
					g[i][j] = 1;
					path.pop();
					return null;
				}
			}
			if (vvs[k].length == 1) {
				deg1V.push([vs[k], vvs[k]]);
			}
		}
		deg1 += deg1V.length;
		if (deg1 < 3) {
			if (deg1 < 2) {
				for (let k = 0; k < vs.length; ++k) {
					if (dfs(vs[k], vvs[k], n, deg1, path)) return path;
				}
			} else {
				for (let [u, vs] of deg1V) {
					if (dfs(u, vs, n, deg1, path)) return path;
				}
			}
		}
		g[i][j] = 1;
		path.pop();
		return null;
	};
	
	if (s.length == 0) {
		for (let i = 0; i < g.length; ++i) {
			for (let j = 0; j < g[0].length; ++j) {
				if (!g[i][j]) continue;
				const path = dfs([i, j], getVs([i, j]), n, deg1, []);
				if (path) return { input, output: path };
			}
		}
	} else {
		for (let u of s) {
			const path = dfs(u, getVs(u), n, deg1, []);
			if (path) return { input, output: path };
		}
	}
	return { input, failed: '未找到路径' };
}


// console.log(solve([
// 	[1, 1, 0, 1, 0, 0],
// 	[1, 1, 1, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[1, 1, 2, 1, 0, 1],
// 	[0, 1, 1, 1, 1, 1]
// ]));
// console.log(solve([
// 	[1, 0, 0, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[2, 1, 1, 1, 1, 1],
// 	[0, 1, 1, 0, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1]
// ]));
// console.log(solve([
// 	[1, 0, 0, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[0, 1, 1, 0, 1, 1],
// 	[1, 1, 1, 1, 1, 1],
// 	[1, 1, 1, 1, 1, 1]
// ]));
// console.log(solve([
// 	[]
// ]));
// console.log(solve([
// 	[0]
// ]));
// console.log(solve([
// 	[1]
// ]));
// console.log(solve([
// 	[1,1]
// ]));
// console.log(solve([
// 	[1,0,1]
// ]));
// console.log(solve([
// 	[1,1,1],
// 	[0,1,0],
// ]));
// console.log(solve([
// 	[1,1,1],
// 	[1,1,1],
// 	[1,1,1]
// ]));
// console.log(solve([
// 	[1,1,1],
// 	[2,1,1],
// 	[1,1,1]
// ]));
// console.log(solve([
// 	[1,1,1],
// 	[1,2,1],
// 	[1,1,1]
// ]));
// console.log(solve([
// 	[1,1,1,1],
// 	[2,1,1,1],
// 	[1,1,1,1]
// ]));
// console.log(solve([
// 	[1,1,1,1],
// 	[1,2,2,1],
// 	[1,1,1,1]
// ]));
// console.log(solve([
// 	[1,1,2,1],
// 	[1,2,2,1],
// 	[1,1,1,1]
// ]));
// console.log(solve([
// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
// 	[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]
// ]));
// console.log(solve([
// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
// 	[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
// 	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
// ]));