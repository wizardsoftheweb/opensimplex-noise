public class LcgInitialization extends Benchmark
{
    void benchmarkCallback(String[] argv)
    {
        long seed = 0L;
        seed = seed * 6364136223846793005L + 1442695040888963407L;
        seed = seed * 6364136223846793005L + 1442695040888963407L;
        seed = seed * 6364136223846793005L + 1442695040888963407L;
    }

    public static void main(String[] argv)
    throws Exception
    {
        LcgInitialization benchmark = new LcgInitialization();
        benchmark.run(argv);
    }
}
