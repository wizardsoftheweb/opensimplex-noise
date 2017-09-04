public abstract class Benchmark
{
    public static final int MAX_COUNT = 100;

    abstract void benchmarkCallback(String[] argv);

    public void run(String[] argv)
    throws Exception
    {
        int maxCount = 0;
        try {
            maxCount = Integer.parseInt(argv[0]);
        } catch (Exception e) {
            maxCount = MAX_COUNT;
        }
        long start = System.nanoTime();
        for (int count = 0; count < maxCount; count++)
        {
            this.benchmarkCallback(argv);
        }
        long elapsed = System.nanoTime() - start;
        long elapsedMicro = elapsed / 1000L;
        System.out.println(elapsedMicro);
    }
}
