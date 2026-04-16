#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/mman.h>
#include <string.h>

#define BLOCK_COUNT 10
#define BLOCK_SIZE  (512 * 1024)   // 512 KiB
#define HEAP_SIZE   (BLOCK_COUNT * BLOCK_SIZE)

int main() {

    printf("PID: %d\n\n", getpid());

    void* heap = NULL;
    void* blocks[BLOCK_COUNT] = { 0 };
    printf("STEP 1: Creating custom heap (%d bytes)...\n", HEAP_SIZE);

    heap = mmap(NULL, HEAP_SIZE,
        PROT_READ | PROT_WRITE,
        MAP_PRIVATE | MAP_ANONYMOUS,
        -1, 0);

    if (heap == MAP_FAILED) {
        perror("mmap heap failed");
        return 1;
    }

    printf("Heap created at: %p\n", heap);
    printf("Press ENTER to continue...\n");
    getchar();
    printf("STEP 2: Allocating 10 blocks of 512 KiB\n");

    for (int i = 0; i < BLOCK_COUNT; i++) {
        blocks[i] = (char*)heap + i * BLOCK_SIZE;

        printf("  Block %d allocated at: %p (%d bytes)\n",
            i, blocks[i], BLOCK_SIZE);
    }

    printf("Press ENTER to continue...\n");
    getchar();
    printf("STEP 3: Filling blocks with integers...\n");

    size_t count_per_block = BLOCK_SIZE / sizeof(int);

    for (int i = 0; i < BLOCK_COUNT; i++) {
        int* arr = (int*)blocks[i];
        for (size_t j = 0; j < count_per_block; j++)
            arr[j] = (int)(i * 1000000 + j);

        printf("  Block %d filled: arr[0]=%d, arr[%zu]=%d\n",
            i, arr[0], count_per_block - 1, arr[count_per_block - 1]);
    }

    printf("Press ENTER to continue...\n");
    getchar();
    printf("STEP 4: Freeing blocks...\n");

    for (int i = 0; i < BLOCK_COUNT; i++) {
        blocks[i] = NULL;  
        printf("  Block %d freed\n", i);
    }

    printf("Press ENTER to continue...\n");
    getchar();
    printf("STEP 5: Destroying heap...\n");

    if (munmap(heap, HEAP_SIZE) != 0) {
        perror("munmap heap failed");
        return 1;
    }
    printf("Heap destroyed.\n");

    return 0;
}
