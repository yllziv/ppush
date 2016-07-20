let exec = require('child_process').exec;
let currentBranch = '';

function execOrder (order) {
    let free = exec(order);
    return new Promise(function (resolve, reject) {
        free.stdout.on('data', function (data) {
            resolve(data);
        });
        free.stderr.on('data', function (data) {
            reject(data + '');
        });
    });
}

function consoleLog(data) {
    console.log(data + '');
}
exports.pushCode = function () {
    execOrder('git status')
    .then(function (status) {
        console.log(status.toString());
        if (status.toString().indexOf('nothing to commit, working directory clean') != -1) {
            return execOrder('git branch')
        }
        else {
            console.log('请提交代码：[git add .], [git commit -m ""]');
        }
    }, consoleLog)
    .then(function (branch) {
        let branchArray = branch.toString().split(/\s/);
        currentBranch = branchArray[branchArray.indexOf('*') + 1];
        console.log('当前分支：' + currentBranch)
        if (currentBranch) {
            return execOrder('git pull origin master');
        }
        else {
            console.log('当前分支有问题');
        }
    }, consoleLog)
    .then(function (pullData) {
        console.log(pullData.toString());
        console.log('pull下来了')
        if (pullData.toString().indexOf('Already up-to-date.') != -1) {
            console.log('git push origin ' + currentBranch)
            return execOrder('git push origin ' + currentBranch);
        }
        else {
            console.log('代码未提交或者未更新');
        }
    }, function (data) {
        console.log(data + '');
        return execOrder('git push origin ' + currentBranch);
    })
    .then(function (pushData) {
        console.log(pushData.toString())
    }, consoleLog)
};

