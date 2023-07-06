import ora from 'ora';
const Loading = (option) => {
    option = typeof option === "string" ? { text: option } : option;
    const color = ["black", "red", "green", "yellow", "blue", "gray", "magenta", "cyan", "white"];
    const spinner = ora({
        spinner: 'dots2',
        isEnabled: true,
        ...option
    }).start();
    const timer = setInterval(() => {
        spinner.color = color.pop();
        color.unshift(spinner.color);
    }, 1000);
    const stop = spinner.stop;
    spinner.stop = () => {
        clearInterval(timer);
        return stop.call(spinner);
    };
    return spinner;
};
export default Loading;
